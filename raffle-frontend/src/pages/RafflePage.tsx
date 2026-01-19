import { useEffect, useState } from 'react';
import { getAllRaffleItems, performRaffle, getAllStudents, getSystemState, type RaffleWinner } from '../services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Trophy, RefreshCw, Info, History, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function RafflePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [winner, setWinner] = useState<RaffleWinner | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkState();
  }, []);
  
  const checkState = async () => {
    try {
      const response = await getSystemState();
      if (response.success && response.data) {
        if (response.data.state !== 'RAFFLE_STARTED') {
          alert('Raffle session is not active!');
          navigate('/waiting');
          return;
        }
      }
      // If authentic, load data
      fetchItems();
      fetchStudentCount();
      setCheckingAuth(false);
    } catch (err) {
      console.error('Auth check failed');
      navigate('/waiting');
    }
  };

  useEffect(() => {
    if (checkingAuth) return;
    
    // Poll for student count every 3 seconds
    const interval = setInterval(fetchStudentCount, 3000);
    return () => clearInterval(interval);
  }, [checkingAuth]);

  const fetchStudentCount = async () => {
    try {
      const response = await getAllStudents();
      if (response.success && response.data) {
        setStudentCount(response.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await getAllRaffleItems();
      if (response.success && response.data) {
        const availableItems = response.data.filter(item => item.quantity > 0);
        setItems(availableItems);
        if (availableItems.length > 0) {
          setSelectedItem(availableItems[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  };

  const handleDrawWinner = async () => {
    setLoading(true);
    setShowResult(false);
    
    try {
      const response = await performRaffle(quantity);
      if (response.success && response.data && response.data.length > 0) {
        setWinner(response.data[0]);
        setShowResult(true);
        await fetchItems();
      } else {
        alert(response.message || 'No winners available');
      }
    } catch (err) {
      alert('Failed to perform raffle');
    } finally {
      setLoading(false);
    }
  };

  const handleNextRound = () => {
    setShowResult(false);
    setWinner(null);
  };

  if (showResult && winner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-8">
        <Card className="max-w-2xl w-full shadow-2xl border-2">
          <CardHeader className="text-center space-y-4 pb-8">
            <Badge className="mx-auto bg-green-500 hover:bg-green-500">
              <Trophy className="w-4 h-4 mr-1" />
              Winner Selected
            </Badge>
            <CardTitle className="text-4xl sm:text-5xl lg:text-6xl font-bold break-all">
              {winner.studentId}
            </CardTitle>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Prize Won</p>
              <p className="text-2xl sm:text-3xl font-semibold">{winner.item.name}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleNextRound}
                className="flex-1 h-12"
                size="lg"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Draw Next Winner
              </Button>
              <Button 
                onClick={() => navigate('/logs')}
                variant="outline"
                className="flex-1 h-12"
                size="lg"
              >
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Raffle Control Panel</h1>
            <p className="text-muted-foreground">Manage and conduct raffle draws</p>
          </div>
          <div className="flex gap-3">
            <Badge variant="secondary" className="text-base px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {studentCount} Students
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              <Package className="w-4 h-4 mr-2" />
              {items.length} Items
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inventory Sidebar */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Inventory
              </CardTitle>
              <CardDescription>Available raffle items</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No items available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => setSelectedItem(item.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedItem === item.name
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                      <Badge variant={selectedItem === item.name ? "secondary" : "outline"}>
                        {item.quantity}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Draw Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Draw Winner
                </CardTitle>
                <CardDescription>Select item and number of winners to draw</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-select">Selected Item</Label>
                    <select
                      id="item-select"
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      disabled={items.length === 0}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {items.map((item) => (
                        <option key={item._id} value={item.name}>
                          {item.name} (Available: {item.quantity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Number of Winners</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDrawWinner}
                    disabled={loading || items.length === 0}
                    className="flex-1 h-12 bg-green-500 hover:bg-green-600"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Drawing...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        Draw Winner
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={fetchItems}
                    variant="outline"
                    className="h-12"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-blue-900">How it works</p>
                    <p className="text-sm text-blue-700">
                      Select an item from the inventory, choose the number of winners, and click "Draw Winner" to randomly select students. Winners will be displayed and logged in the history.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
