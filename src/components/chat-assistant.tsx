"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    // We can provide a welcoming initial message
    initialMessages: [
      {
        id: "welcome-msg",
        role: "assistant",
        content: "Hi there! I'm your neutral election assistant. I can help answer questions about voting timelines, registration steps, and state-specific processes. How can I help you today?",
      },
    ],
  });

  // Automatically scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-[360px] sm:max-w-[400px] shadow-2xl rounded-2xl overflow-hidden font-sans border border-slate-200"
          >
            <Card className="border-0 shadow-none rounded-none flex flex-col h-[500px] max-h-[80vh] bg-white">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-900 text-white pb-3 rounded-t-2xl flex flex-row items-center justify-between space-y-0 relative">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800">
                    <Bot className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold tracking-wide flex items-center gap-2">
                      CivicNode AI
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </CardTitle>
                    <p className="text-[10px] text-slate-300 font-medium">Non-partisan voting guide</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              
              <ScrollArea 
                className="flex-1 p-4 bg-slate-50" 
                viewportRef={scrollRef}
              >
                <div className="space-y-4 pb-2">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user"
                            ? "bg-orange-500 text-white"
                            : "bg-slate-900 text-orange-500"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="w-3.5 h-3.5" />
                        ) : (
                          <Bot className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div
                        className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                          message.role === "user"
                            ? "bg-orange-500 text-white rounded-br-none"
                            : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 flex-row"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-orange-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-white border border-slate-100 rounded-bl-none shadow-sm flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="flex justify-center">
                      <div className="text-xs text-red-500 bg-red-50 py-1.5 px-3 rounded-full border border-red-100">
                        Failed to connect. Is OPENAI_API_KEY set?
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <CardFooter className="p-3 bg-white border-t border-slate-100">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full items-center gap-2"
                >
                  <Input
                    placeholder="Ask about election dates..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1 rounded-full border-slate-200 bg-slate-50 focus-visible:ring-orange-500 h-10 px-4 shadow-none"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input?.trim()}
                    className="h-10 w-10 p-0 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex-shrink-0 transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 ml-0.5" />
                    )}
                    <span className="sr-only">Send message</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 transition-colors focus:outline-none focus:ring-4 focus:ring-orange-500/20"
        aria-label="Toggle AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
