'use client';

import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const firstMessage = "Hi! I'm the Camp Code support assistant. How can I help you today?";

  const sendMessage = async () => {
    if (message.trim() === "") return;

    setMessage('');
    setMessages(messages => [
      ...messages,
      { role: "user", parts: [{ text: message }] }
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...messages, { role: "user", parts: [{ text: message }] }])
      });

      const data = await response.json();
      setMessages(messages => [
        ...messages,
        { role: "model", parts: [{ text: data.text }] }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#121212"
      p={2}
    >
      <Stack
        direction="column"
        width="80%"
        height="90%"
        maxHeight="90%"
        border="1px solid #333"
        borderRadius={4}
        spacing={2}
        bgcolor="#1f1f1f"
        boxShadow="0 2px 5px rgba(0,0,0,0.5)"
        p={2}
      >
        <Stack direction="column" spacing={2} overflow="auto" flexGrow={1}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            mb={1}
          >
            <Box
              bgcolor="#2c2c2c"
              color="#e0e0e0"
              borderRadius={2}
              p={2}
              maxWidth="80%"
              wordBreak="break-word"
              boxShadow="0 2px 4px rgba(0,0,0,0.5)"
            >
              <Typography variant="body1">{firstMessage}</Typography>
            </Box>
          </Box>
          {messages.map((textObject, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection={textObject.role === 'user' ? 'row-reverse' : 'row'}
              mb={1}
            >
              <Box
                bgcolor={textObject.role === 'user' ? '#007aff' : '#2c2c2c'}
                color="white"
                borderRadius={2}
                p={2}
                maxWidth="80%"
                wordBreak="break-word"
                boxShadow="0 2px 4px rgba(0,0,0,0.5)"
              >
                {textObject.parts[0].text}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type your message here"
            InputProps={{
              style: {
                borderRadius: 20,
                color: 'white',
                backgroundColor: '#333',
                borderColor: '#444',
              },
            }}
            InputLabelProps={{
              style: { color: '#888' },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            style={{
              height: '100%',
              backgroundColor: '#007aff'
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
