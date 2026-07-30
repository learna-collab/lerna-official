"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";

interface MobileNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredCount: number;
  answers: Record<string, string>;
  questionIds: string[];
  onNavigate: (index: number) => void;
}

export function MobileNavigator({
  totalQuestions,
  currentQuestion,
  answeredCount,
  answers,
  questionIds,
  onNavigate,
}: MobileNavigatorProps) {
  return (
    <div className="md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">
            <Menu className="mr-2 h-4 w-4" />
            Questions ({answeredCount}/{totalQuestions})
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Question Navigator</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4 px-4 pb-6">
            <div className="text-sm text-muted-foreground">
              {answeredCount} of {totalQuestions} answered
            </div>

            <div className="grid grid-cols-5 gap-3">
              {questionIds.map((id, index) => {
                const answered = Boolean(answers[id]);
                const active = currentQuestion === index;

                return (
                  <Button
                    key={id}
                    variant={active ? "default" : "outline"}
                    className={`h-12 w-full ${
                      answered
                        ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300"
                        : ""
                    }`}
                    onClick={() => onNavigate(index)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>

            <div className="space-y-2 rounded-lg border p-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span>Current Question</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Answered</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border" />
                <span>Not Answered</span>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
