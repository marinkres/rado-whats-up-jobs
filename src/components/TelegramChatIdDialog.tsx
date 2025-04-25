import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TelegramChatIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (chatId: string) => void;
}

export function TelegramChatIdDialog({ open, onOpenChange, onSave }: TelegramChatIdDialogProps) {
  const [chatId, setChatId] = useState("");

  const handleSave = () => {
    onSave(chatId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Your Telegram Chat ID</DialogTitle>
          <DialogDescription>
            To get your Telegram chat ID, message @userinfobot on Telegram.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter your Telegram chat ID"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
            <p className="text-sm text-gray-500">Your ID should be a number like 5359794600</p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
            <p className="text-sm text-amber-800">
              ℹ️ Send a message to <span className="font-bold">@userinfobot</span> on Telegram to get your ID
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!chatId.trim()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
