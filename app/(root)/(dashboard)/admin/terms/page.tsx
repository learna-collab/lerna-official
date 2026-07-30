"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Plus, CheckCircle, Trash2, Power } from "lucide-react";

import { AdminService } from "@/app/services/admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Term {
  id: string;
  name: string;
  sort_order?: number;
  is_active?: boolean;
}

export default function TermsPage() {
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [open, setOpen] = useState(false);

  const [terms, setTerms] = useState<Term[]>([]);

  const [name, setName] = useState("");

  const [sortOrder, setSortOrder] = useState("0");

  const loadTerms = async () => {
    try {
      setLoading(true);

      const data = await AdminService.getTerms();

      setTerms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load terms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadTerms());
  }, []);

  const createTerm = async () => {
    if (!name) {
      toast.error("Term name is required");

      return;
    }

    try {
      setCreating(true);

      await AdminService.createTerm({
        name,
        sort_order: Number(sortOrder),
      });

      toast.success("Term created successfully");

      setName("");
      setSortOrder("0");
      setOpen(false);

      await loadTerms();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create term");
    } finally {
      setCreating(false);
    }
  };

  const activateTerm = async (termId: string) => {
    try {
      await AdminService.activateTerm(termId);

      toast.success("Term activated successfully");

      await loadTerms();
    } catch (error) {
      console.error(error);

      toast.error("Failed to activate term");
    }
  };

  const deactivateTerm = async (termId: string) => {
    try {
      await AdminService.deactivateTerm(termId);

      toast.success("Term deactivated successfully");

      await loadTerms();
    } catch (error) {
      console.error(error);

      toast.error("Failed to deactivate term");
    }
  };

  const deleteTerm = async (termId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this term?",
    );

    if (!confirmed) return;

    try {
      await AdminService.deleteTerm(termId);

      toast.success("Term deleted successfully");

      await loadTerms();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete term");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Terms</h1>

          <p className="text-muted-foreground">
            Create and manage academic terms for all schools
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Term
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Academic Term</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Term Name</label>

                <Input
                  placeholder="e.g. First Term"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>

                <Input
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={createTerm}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Term"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-10 text-center">
            Loading terms...
          </CardContent>
        </Card>
      ) : terms.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            No terms found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {terms.map((term) => (
            <Card
              key={term.id}
              className="transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{term.name}</CardTitle>

                    <p className="text-muted-foreground mt-1 text-sm">
                      Academic Term
                    </p>
                  </div>

                  {term.is_active ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="rounded-lg bg-muted/50 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sort Order</span>

                    <span className="font-medium">{term.sort_order ?? 0}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!term.is_active ? (
                    <Button
                      className="flex-1"
                      onClick={() => activateTerm(term.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Activate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => deactivateTerm(term.id)}
                    >
                      <Power className="mr-2 h-4 w-4" />
                      Deactivate
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteTerm(term.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
