"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Shield, Flag, Trash2, AlertTriangle } from 'lucide-react'
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useRouter } from "next/navigation"
import { Id } from "../../convex/_generated/dataModel"

interface ModerationControlsProps {
  threadId: string;
  isModerator: boolean;
}

export default function ModerationControls({ threadId, isModerator }: ModerationControlsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!isModerator) {
    return null;
  }
  
  // In a real app, you would implement these mutations in Convex
  const handleDeleteThread = async () => {
    setIsDeleting(true);
    try {
      // This would be a real mutation in a complete implementation
      console.log(`Deleting thread ${threadId}`);
      // Redirect to topics page after deletion
      router.push("/topics");
    } catch (error) {
      console.error("Failed to delete thread:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="border rounded-md p-4 bg-muted/20 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Moderator Controls</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Flag className="h-4 w-4" />
          <span>Flag Thread</span>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              <span>Delete Thread</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the thread
                and all its replies from the forum.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteThread}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <AlertTriangle className="h-4 w-4" />
          <span>Lock Thread</span>
        </Button>
      </div>
    </div>
  );
}