'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, ArrowLeft, Database, Plus, Trash2, Code, Sparkles, Copy, Check, ChevronDown } from 'lucide-react';
import { generateSQL } from '@/lib/schema-utils';
import { toast } from '@/components/ui/use-toast';
import type { SchemaTable, SchemaColumn } from '@/types';

const SQL_TYPES = [
  { value: 'INTEGER', label: 'INTEGER', description: 'Whole numbers' },
  { value: 'TEXT', label: 'TEXT', description: 'Variable length text' },
  { value: 'VARCHAR(255)', label: 'VARCHAR(255)', description: 'Limited text' },
  { value: 'BOOLEAN', label: 'BOOLEAN', description: 'True/False' },
  { value: 'TIMESTAMP', label: 'TIMESTAMP', description: 'Date and time' },
  { value: 'DATE', label: 'DATE', description: 'Date only' },
  { value: 'DECIMAL(10,2)', label: 'DECIMAL(10,2)', description: 'Currency/precise' },
  { value: 'FLOAT', label: 'FLOAT', description: 'Decimal numbers' },
  { value: 'UUID', label: 'UUID', description: 'Unique identifier' },
  { value: 'JSON', label: 'JSON', description: 'JSON data' },
  { value: 'BLOB', label: 'BLOB', description: 'Binary data' },
];

const CONSTRAINTS = [
  { value: 'PRIMARY KEY', label: 'Primary Key', color: 'text-cyan-400' },
  { value: 'NOT NULL', label: 'Not Null', color: 'text-yellow-400' },
  { value: 'UNIQUE', label: 'Unique', color: 'text-purple-400' },
  { value: 'DEFAULT', label: 'Default', color: 'text-green-400' },
  { value: 'REFERENCES', label: 'Foreign Key', color: 'text-orange-400' },
];

function TypeDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-lg">
            {SQL_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onChange(type.value);
                  setIsOpen(false);
                }}
              >
                <span className="font-mono">{type.label}</span>
                <span className="text-xs text-muted-foreground">{type.description}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ConstraintBadges({
  constraints,
  onChange,
}: {
  constraints: string[];
  onChange: (constraints: string[]) => void;
}) {
  const toggleConstraint = (constraint: string) => {
    if (constraints.includes(constraint)) {
      onChange(constraints.filter((c) => c !== constraint));
    } else {
      onChange([...constraints, constraint]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {CONSTRAINTS.map((c) => {
        const isActive = constraints.some((con) => con.toUpperCase().includes(c.value));
        return (
          <button
            key={c.value}
            type="button"
            onClick={() => toggleConstraint(c.value)}
            className={`px-2 py-0.5 text-xs rounded-full border transition-all ${
              isActive
                ? 'bg-primary/20 border-primary text-primary'
                : 'border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary/70'
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

export function SchemaEditor() {
  const { schemaData, setSchemaData, nextStep, prevStep, databaseType, optimizedData, workflowData, projectType, setLoading, setError } = useAppStore();
  const [tables, setTables] = useState<SchemaTable[]>(schemaData?.tables || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSQL, setShowSQL] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!schemaData && optimizedData && workflowData && databaseType) {
      generateSchema();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateSchema = async () => {
    setIsGenerating(true);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optimizedData, workflowData, projectType, databaseType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate schema');
      }

      const data = await response.json();
      setTables(data.tables);
      setSchemaData(data);
      toast({
        title: 'Schema Generated!',
        description: `Created ${data.tables.length} tables`,
        variant: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate schema';
      console.error('Error generating schema:', error);
      setError(message);
      toast({
        title: 'Generation Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleColumnChange = (tableIndex: number, columnIndex: number, field: keyof SchemaColumn, value: string | string[]) => {
    const newTables = [...tables];
    if (field === 'constraints') {
      newTables[tableIndex].columns[columnIndex][field] = value as string[];
    } else {
      newTables[tableIndex].columns[columnIndex][field as 'name' | 'type'] = value as string;
    }
    setTables(newTables);
  };

  const addColumn = (tableIndex: number) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.push({ name: 'new_column', type: 'TEXT', constraints: [] });
    setTables(newTables);
    toast({
      title: 'Column Added',
      description: `New column added to ${tables[tableIndex].name}`,
      variant: 'default',
    });
  };

  const removeColumn = (tableIndex: number, columnIndex: number) => {
    const newTables = [...tables];
    const columnName = newTables[tableIndex].columns[columnIndex].name;
    newTables[tableIndex].columns.splice(columnIndex, 1);
    setTables(newTables);
    toast({
      title: 'Column Removed',
      description: `Removed "${columnName}" from ${tables[tableIndex].name}`,
      variant: 'default',
    });
  };

  const handleCopySQL = async () => {
    const sql = generateSQL(tables, databaseType || 'postgresql');
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'SQL schema copied to clipboard',
      variant: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    setSchemaData({ tables });
    nextStep();
  };

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="relative inline-block">
          <Sparkles className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-cyan-400/30 animate-ping" />
        </div>
        <p className="text-muted-foreground">Generating database schema...</p>
        <p className="text-sm text-muted-foreground/70 mt-2">Analyzing your workflow to create optimal tables</p>
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
        <Card className="bg-gray-900 relative group">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopySQL}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          <CardContent className="pt-6">
            <pre className="text-sm text-green-400 overflow-x-auto">
              {generateSQL(tables, databaseType || 'postgresql')}
            </pre>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {tables.map((table, tableIndex) => (
          <Card key={tableIndex} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                {table.name}
              </CardTitle>
              <CardDescription>
                {table.columns.length} column{table.columns.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground px-2 pb-2 border-b border-border">
                  <div className="col-span-3">Column Name</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-5">Constraints</div>
                  <div className="col-span-1"></div>
                </div>
                {table.columns.map((column, columnIndex) => (
                  <div key={columnIndex} className="grid grid-cols-12 gap-2 items-center group hover:bg-muted/20 rounded-md p-1 -mx-1">
                    <Input
                      className="col-span-3 h-9 text-sm font-mono"
                      value={column.name}
                      onChange={(e) => handleColumnChange(tableIndex, columnIndex, 'name', e.target.value)}
                      aria-label={`Column name for ${column.name}`}
                    />
                    <div className="col-span-3">
                      <TypeDropdown
                        value={column.type}
                        onChange={(value) => handleColumnChange(tableIndex, columnIndex, 'type', value)}
                      />
                    </div>
                    <div className="col-span-5">
                      <ConstraintBadges
                        constraints={column.constraints}
                        onChange={(constraints) => handleColumnChange(tableIndex, columnIndex, 'constraints', constraints)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="col-span-1 h-9 w-9 text-destructive hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeColumn(tableIndex, columnIndex)}
                      aria-label={`Remove column ${column.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addColumn(tableIndex)}
                  className="gap-2 mt-2"
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
