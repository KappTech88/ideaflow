'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, ArrowLeft, Database, Plus, Trash2, Code, Sparkles } from 'lucide-react';
import type { SchemaTable, SchemaColumn } from '@/types';

function generateSQL(tables: SchemaTable[], dbType: string): string {
  return tables.map((table) => {
    const columns = table.columns.map((col) => {
      let type = col.type;
      if (dbType === 'mysql') {
        if (type === 'SERIAL') type = 'INT AUTO_INCREMENT';
        if (type === 'TEXT') type = 'TEXT';
      } else if (dbType === 'sqlite') {
        if (type === 'SERIAL') type = 'INTEGER';
        if (type === 'VARCHAR(255)') type = 'TEXT';
      }
      const constraints = col.constraints.join(' ');
      return `  ${col.name} ${type}${constraints ? ' ' + constraints : ''}`;
    }).join(',\n');

    return `CREATE TABLE ${table.name} (\n${columns}\n);`;
  }).join('\n\n');
}

export function SchemaEditor() {
  const { schemaData, setSchemaData, nextStep, prevStep, databaseType, optimizedData, workflowData, projectType, setLoading } = useAppStore();
  const [tables, setTables] = useState<SchemaTable[]>(schemaData?.tables || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSQL, setShowSQL] = useState(false);

  useEffect(() => {
    if (!schemaData && optimizedData && workflowData && databaseType) {
      generateSchema();
    }
  }, []);

  const generateSchema = async () => {
    setIsGenerating(true);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optimizedData, workflowData, projectType, databaseType }),
      });

      if (!response.ok) throw new Error('Failed to generate schema');

      const data = await response.json();
      setTables(data.tables);
      setSchemaData(data);
    } catch (error) {
      console.error('Error generating schema:', error);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleColumnChange = (tableIndex: number, columnIndex: number, field: keyof SchemaColumn, value: string) => {
    const newTables = [...tables];
    if (field === 'constraints') {
      newTables[tableIndex].columns[columnIndex][field] = value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      newTables[tableIndex].columns[columnIndex][field] = value;
    }
    setTables(newTables);
  };

  const addColumn = (tableIndex: number) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.push({ name: 'new_column', type: 'TEXT', constraints: [] });
    setTables(newTables);
  };

  const removeColumn = (tableIndex: number, columnIndex: number) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.splice(columnIndex, 1);
    setTables(newTables);
  };

  const handleContinue = () => {
    setSchemaData({ tables });
    nextStep();
  };

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <Sparkles className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Generating database schema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
          Database Schema
        </h2>
        <p className="mt-2 text-muted-foreground">
          Review and customize your database structure
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={generateSchema} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Regenerate
        </Button>
        <Button variant="outline" onClick={() => setShowSQL(!showSQL)} className="gap-2">
          <Code className="h-4 w-4" />
          {showSQL ? 'Hide SQL' : 'Show SQL'}
        </Button>
      </div>

      {showSQL && (
        <Card className="bg-gray-900">
          <CardContent className="pt-6">
            <pre className="text-sm text-green-400 overflow-x-auto">
              {generateSQL(tables, databaseType || 'postgresql')}
            </pre>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {tables.map((table, tableIndex) => (
          <Card key={tableIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                {table.name}
              </CardTitle>
              <CardDescription>
                {table.columns.length} columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground px-2">
                  <div className="col-span-3">Column Name</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-5">Constraints</div>
                  <div className="col-span-1"></div>
                </div>
                {table.columns.map((column, columnIndex) => (
                  <div key={columnIndex} className="grid grid-cols-12 gap-2 items-center">
                    <Input
                      className="col-span-3 h-9 text-sm"
                      value={column.name}
                      onChange={(e) => handleColumnChange(tableIndex, columnIndex, 'name', e.target.value)}
                    />
                    <Input
                      className="col-span-3 h-9 text-sm"
                      value={column.type}
                      onChange={(e) => handleColumnChange(tableIndex, columnIndex, 'type', e.target.value)}
                    />
                    <Input
                      className="col-span-5 h-9 text-sm"
                      value={column.constraints.join(', ')}
                      onChange={(e) => handleColumnChange(tableIndex, columnIndex, 'constraints', e.target.value)}
                      placeholder="PRIMARY KEY, NOT NULL, etc."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="col-span-1 h-9 w-9 text-destructive hover:text-destructive"
                      onClick={() => removeColumn(tableIndex, columnIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addColumn(tableIndex)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Column
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={tables.length === 0}
          className="gap-2"
        >
          Choose Dev Environment
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
