
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

const NotLoggedInView: React.FC = () => {
  return (
    <div className="container mx-auto py-20">
      <Card className="bg-black/30 backdrop-blur-md border border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
          <CardDescription className="text-zinc-400">
            You need to be logged in to view this page.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotLoggedInView;
