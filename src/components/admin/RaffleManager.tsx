
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calendar, Ticket, Clock, Edit, Trash2, Plus, Eye, Award } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';

interface RaffleItem {
  id: string;
  title: string;
  description: string;
  image: string;
  totalTickets: number;
  ticketsSold: number;
  price: number;
  paymentMethod: 'jestcoin' | 'money' | 'both';
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const RaffleManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  // Sample raffle data
  const raffles: RaffleItem[] = [
    {
      id: 'raffle-1',
      title: 'Exclusive Mansion Access',
      description: 'Win a VIP pass to the next JESTFLY mansion event with backstage access and meet & greet.',
      image: '/assets/imagem1.jpg',
      totalTickets: 1000,
      ticketsSold: 650,
      price: 250,
      paymentMethod: 'jestcoin',
      startDate: '2023-10-01T00:00:00',
      endDate: '2023-12-31T23:59:59',
      isActive: true
    },
    {
      id: 'raffle-2',
      title: 'Limited Edition Vinyl Set',
      description: 'Signed vinyl collection of all JESTFLY releases in a custom display case.',
      image: '/assets/imagem1.jpg',
      totalTickets: 500,
      ticketsSold: 210,
      price: 100,
      paymentMethod: 'both',
      startDate: '2023-09-15T00:00:00',
      endDate: '2023-11-15T23:59:59',
      isActive: true
    },
    {
      id: 'raffle-3',
      title: 'Production Masterclass',
      description: 'One-on-one production session with JESTFLY in the studio.',
      image: '/assets/imagem1.jpg',
      totalTickets: 100,
      ticketsSold: 85,
      price: 500,
      paymentMethod: 'jestcoin',
      startDate: '2023-09-01T00:00:00',
      endDate: '2023-10-30T23:59:59',
      isActive: true
    },
    {
      id: 'raffle-4',
      title: 'Studio Tour',
      description: 'Private tour of JESTFLY production studio with a group of friends.',
      image: '/assets/imagem1.jpg',
      totalTickets: 200,
      ticketsSold: 200,
      price: 150,
      paymentMethod: 'jestcoin',
      startDate: '2023-08-01T00:00:00',
      endDate: '2023-09-15T23:59:59',
      isActive: false
    }
  ];
  
  const activeRaffles = raffles.filter(raffle => raffle.isActive);
  const pastRaffles = raffles.filter(raffle => !raffle.isActive);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-700/30">
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-500/20 p-3 rounded-full mr-4">
              <Ticket className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Active Raffles</p>
              <h3 className="text-2xl font-bold">{activeRaffles.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/30">
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-500/20 p-3 rounded-full mr-4">
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Past Raffles</p>
              <h3 className="text-2xl font-bold">{pastRaffles.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-green-700/30">
          <CardContent className="flex items-center p-6">
            <div className="bg-green-500/20 p-3 rounded-full mr-4">
              <Award className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">Total Tickets Sold</p>
              <h3 className="text-2xl font-bold">
                {raffles.reduce((total, raffle) => total + raffle.ticketsSold, 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Raffles</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Raffle
        </Button>
      </div>
      
      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="active">Active Raffles</TabsTrigger>
          <TabsTrigger value="past">Past Raffles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Ticket Price</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeRaffles.map(raffle => (
                    <TableRow key={raffle.id}>
                      <TableCell>
                        <div className="font-semibold">{raffle.title}</div>
                        <div className="text-xs text-gray-400">{raffle.id}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-bold">{raffle.price}</span>
                      </TableCell>
                      <TableCell>
                        {raffle.paymentMethod === 'jestcoin' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-900/30 text-yellow-400">
                            JestCoin
                          </span>
                        )}
                        {raffle.paymentMethod === 'money' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-900/30 text-green-400">
                            Money
                          </span>
                        )}
                        {raffle.paymentMethod === 'both' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-900/30 text-blue-400">
                            Both
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{raffle.ticketsSold} / {raffle.totalTickets}</div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-purple-600 h-1.5 rounded-full" 
                            style={{ width: `${(raffle.ticketsSold / raffle.totalTickets) * 100}%` }}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div className="flex items-center text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            Start: {formatDate(raffle.startDate)}
                          </div>
                          <div className="flex items-center mt-0.5">
                            <Clock className="h-3 w-3 mr-1" />
                            End: {formatDate(raffle.endDate)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch checked={raffle.isActive} />
                          <span>Active</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Ticket Price</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Tickets Sold</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastRaffles.map(raffle => (
                    <TableRow key={raffle.id}>
                      <TableCell>
                        <div className="font-semibold">{raffle.title}</div>
                        <div className="text-xs text-gray-400">{raffle.id}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-bold">{raffle.price}</span>
                      </TableCell>
                      <TableCell>
                        {raffle.paymentMethod === 'jestcoin' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-900/30 text-yellow-400">
                            JestCoin
                          </span>
                        )}
                        {raffle.paymentMethod === 'money' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-900/30 text-green-400">
                            Money
                          </span>
                        )}
                        {raffle.paymentMethod === 'both' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-900/30 text-blue-400">
                            Both
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {raffle.ticketsSold} / {raffle.totalTickets}
                      </TableCell>
                      <TableCell>
                        {formatDate(raffle.endDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="h-8 px-3">
                            <Eye className="h-4 w-4 mr-1" /> View Results
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-purple-500 hover:text-purple-600">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {activeTab === 'active' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Raffle Settings</CardTitle>
            <CardDescription>Configure how raffles work on your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ticketVisibility">Ticket Sales Visibility</Label>
                    <select id="ticketVisibility" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 mt-2">
                      <option value="all">Show all tickets (sold and available)</option>
                      <option value="percentage">Show only percentage sold</option>
                      <option value="hide">Hide ticket sales information</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="winnerSelection">Winner Selection Method</Label>
                    <select id="winnerSelection" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 mt-2">
                      <option value="random">Random selection (equal odds)</option>
                      <option value="weighted">Weighted based on tickets purchased</option>
                      <option value="sequential">Sequential ticket numbers</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="multipleEntries">Allow Multiple Entries</Label>
                      <p className="text-sm text-muted-foreground">Users can purchase multiple tickets for the same raffle</p>
                    </div>
                    <Switch id="multipleEntries" checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoEnd">Auto-End Raffles</Label>
                      <p className="text-sm text-muted-foreground">Automatically end raffles when all tickets are sold</p>
                    </div>
                    <Switch id="autoEnd" checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Raffle Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send email notifications for raffle updates</p>
                    </div>
                    <Switch id="notifications" checked={true} />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RaffleManager;
