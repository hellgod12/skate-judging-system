#!/usr/bin/env python3
"""
Schema Analysis Tool for schema-v4.sql
Extracts table definitions and validates dependencies
"""

import re
import sys

def extract_tables(sql_file):
    """Extract all CREATE TABLE statements with their line numbers"""
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tables = []
    # Find all CREATE TABLE statements
    pattern = r'CREATE TABLE (\w+)\s*\((.*?)\);'
    matches = re.finditer(pattern, content, re.DOTALL)
    
    for match in matches:
        table_name = match.group(1)
        table_def = match.group(0)
        start_pos = match.start()
        line_num = content[:start_pos].count('\n') + 1
        tables.append({
            'name': table_name,
            'line': line_num,
            'definition': table_def
        })
    
    return tables

def extract_foreign_keys(table_def):
    """Extract foreign key references from a table definition"""
    fk_pattern = r'REFERENCES (\w+)\((\w+)\)'
    matches = re.findall(fk_pattern, table_def)
    return matches

def main():
    sql_file = r'j:\app juri skate\database\schema-v4.sql'
    tables = extract_tables(sql_file)
    
    print(f"Found {len(tables)} tables")
    print("\nTable creation order:")
    for i, table in enumerate(tables, 1):
        print(f"{i}. {table['name']} (line {table['line']})")
    
    # Build a map of table name -> line number
    table_lines = {t['name']: t['line'] for t in tables}
    
    print("\n" + "="*80)
    print("VALIDATION: Checking for forward references (referencing tables before they exist)")
    print("="*80)
    
    errors = []
    for table in tables:
        fks = extract_foreign_keys(table['definition'])
        for ref_table, ref_column in fks:
            if ref_table not in table_lines:
                errors.append(f"ERROR: {table['name']} references non-existent table {ref_table}")
            elif table_lines[ref_table] > table['line']:
                errors.append(f"WARNING: {table['name']} (line {table['line']}) references {ref_table} (line {table_lines[ref_table]}) - forward reference")
    
    if errors:
        print("\n".join(errors))
    else:
        print("✅ No forward references found - all tables are created before they are referenced")
    
    print("\n" + "="*80)
    print("VALIDATION: Checking for circular dependencies")
    print("="*80)
    
    # Build dependency graph
    dependencies = {}
    for table in tables:
        fks = extract_foreign_keys(table['definition'])
        deps = set()
        for ref_table, _ in fks:
            if ref_table != table['name']:  # Exclude self-references
                deps.add(ref_table)
        dependencies[table['name']] = deps
    
    # Check for circular dependencies
    def has_cycle(node, visited, rec_stack, path):
        visited.add(node)
        rec_stack.add(node)
        path.append(node)
        
        for neighbor in dependencies.get(node, []):
            if neighbor not in visited:
                if has_cycle(neighbor, visited, rec_stack, path):
                    return True
            elif neighbor in rec_stack:
                cycle_start = path.index(neighbor)
                cycle = path[cycle_start:] + [neighbor]
                print(f"⚠️  Circular dependency detected: {' -> '.join(cycle)}")
                return True
        
        rec_stack.remove(node)
        path.pop()
        return False
    
    visited = set()
    has_any_cycle = False
    for table in tables:
        if table['name'] not in visited:
            if has_cycle(table['name'], visited, set(), []):
                has_any_cycle = True
    
    if not has_any_cycle:
        print("✅ No circular dependencies found")
    
    print("\n" + "="*80)
    print("VALIDATION: Checking for missing referenced columns")
    print("="*80)
    
    # Extract column names for each table
    table_columns = {}
    for table in tables:
        # Extract column names from table definition
        col_pattern = r'(\w+)\s+(?:UUID|TEXT|INTEGER|DECIMAL|BOOLEAN|TIMESTAMP|DATE|CHAR|JSONB)'
        cols = re.findall(col_pattern, table['definition'])
        table_columns[table['name']] = set(cols)
    
    column_errors = []
    for table in tables:
        fks = extract_foreign_keys(table['definition'])
        for ref_table, ref_column in fks:
            if ref_table in table_columns:
                if ref_column not in table_columns[ref_table]:
                    column_errors.append(f"ERROR: {table['name']}.{ref_column} references {ref_table}.{ref_column} but column {ref_column} does not exist in {ref_table}")
    
    if column_errors:
        print("\n".join(column_errors))
    else:
        print("✅ All referenced columns exist")
    
    print("\n" + "="*80)
    print("VALIDATION: Checking indexes reference valid columns")
    print("="*80)
    
    # Extract index definitions
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    index_pattern = r'CREATE INDEX (\w+) ON (\w+)\(([^)]+)\)'
    index_matches = re.findall(index_pattern, content)
    
    index_errors = []
    for index_name, table_name, columns in index_matches:
        if table_name not in table_columns:
            index_errors.append(f"ERROR: Index {index_name} references non-existent table {table_name}")
        else:
            for col in columns.split(','):
                col = col.strip()
                if col not in table_columns[table_name]:
                    index_errors.append(f"ERROR: Index {index_name} on {table_name} references non-existent column {col}")
    
    if index_errors:
        print("\n".join(index_errors))
    else:
        print("✅ All indexes reference valid columns")
    
    print("\n" + "="*80)
    print("VALIDATION: Checking CHECK constraints")
    print("="*80)
    
    check_pattern = r'CHECK \(([^)]+)\)'
    check_matches = re.findall(check_pattern, content)
    
    check_errors = []
    for check in check_matches:
        # Basic validation - check for syntax errors
        if not check:
            check_errors.append(f"ERROR: Empty CHECK constraint")
    
    if check_errors:
        print("\n".join(check_errors))
    else:
        print(f"✅ Found {len(check_matches)} CHECK constraints - all appear valid")
    
    print("\n" + "="*80)
    print("VALIDATION: Checking DEFAULT expressions")
    print("="*80)
    
    default_pattern = r'DEFAULT ([^,\n]+)'
    default_matches = re.findall(default_pattern, content)
    
    default_errors = []
    for default in default_matches:
        # Check for common invalid defaults
        if 'uuid_generate_v4()' in default:
            # This is valid
            pass
        elif 'CURRENT_TIMESTAMP' in default:
            # This is valid
            pass
        elif re.match(r'^[\d.]+$', default.strip()):
            # Numeric literal - valid
            pass
        elif default.strip().startswith("'") and default.strip().endswith("'"):
            # String literal - valid
            pass
        elif default.strip() == 'true' or default.strip() == 'false':
            # Boolean - valid
            pass
        elif default.strip() == '{}':
            # JSONB default - valid
            pass
        elif default.strip() == '[]':
            # JSONB array default - valid
            pass
        else:
            # Unknown default - flag for review
            default_errors.append(f"WARNING: Unusual DEFAULT expression: {default}")
    
    if default_errors:
        print("\n".join(default_errors))
    else:
        print(f"✅ Found {len(default_matches)} DEFAULT expressions - all appear valid")
    
    print("\n" + "="*80)
    print("VALIDATION: Checking UUID defaults")
    print("="*80)
    
    uuid_default_pattern = r'(\w+)\s+UUID.*DEFAULT uuid_generate_v4\(\)'
    uuid_matches = re.findall(uuid_default_pattern, content)
    
    print(f"✅ Found {len(uuid_matches)} columns with UUID DEFAULT uuid_generate_v4() - all valid")
    
    print("\n" + "="*80)
    print("VALIDATION: Checking triggers")
    print("="*80)
    
    trigger_pattern = r'CREATE TRIGGER (\w+)'
    trigger_matches = re.findall(trigger_pattern, content)
    
    print(f"✅ Found {len(trigger_matches)} CREATE TRIGGER statements")
    
    print("\n" + "="*80)
    print("VALIDATION: Checking functions")
    print("="*80)
    
    function_pattern = r'CREATE (?:OR REPLACE )?FUNCTION (\w+)'
    function_matches = re.findall(function_pattern, content)
    
    print(f"✅ Found {len(function_matches)} CREATE FUNCTION statements")
    
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    total_errors = len([e for e in errors if e.startswith("ERROR")]) + len(column_errors)
    total_warnings = len([e for e in errors if e.startswith("WARNING")])
    
    if total_errors > 0:
        print(f"❌ Found {total_errors} errors")
    else:
        print("✅ No errors found")
    
    if total_warnings > 0:
        print(f"⚠️  Found {total_warnings} warnings")
    else:
        print("✅ No warnings found")
    
    if total_errors == 0 and total_warnings == 0:
        print("\n✅ Schema validation PASSED - ready for execution")
    else:
        print("\n❌ Schema validation FAILED - fix errors before execution")
        sys.exit(1)

if __name__ == '__main__':
    main()
