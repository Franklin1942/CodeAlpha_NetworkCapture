import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Activity, Network, Shield, Zap } from "lucide-react";
import { PacketList } from "./PacketList";
import { PacketDetails } from "./PacketDetails";
import { NetworkStats } from "./NetworkStats";
import { ProtocolAnalysis } from "./ProtocolAnalysis";

export interface NetworkPacket {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  data: string;
  flags?: string[];
}

const NetworkSniffer = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<NetworkPacket | null>(null);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [totalPackets, setTotalPackets] = useState(0);

  // Mock packet generation
  const generateMockPacket = (): NetworkPacket => {
    const protocols = ['HTTP', 'HTTPS', 'TCP', 'UDP', 'DNS', 'ARP', 'ICMP'];
    const sources = ['192.168.1.10', '10.0.0.1', '172.16.0.5', '8.8.8.8', '1.1.1.1'];
    const destinations = ['192.168.1.1', '10.0.0.10', '172.16.0.1', '8.8.4.4', '1.0.0.1'];
    
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      source,
      destination,
      protocol,
      length: Math.floor(Math.random() * 1500) + 64,
      info: `${protocol} packet from ${source} to ${destination}`,
      data: `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`,
      flags: protocol === 'TCP' ? ['SYN', 'ACK'] : undefined
    };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCapturing) {
      interval = setInterval(() => {
        const newPacket = generateMockPacket();
        setPackets(prev => [newPacket, ...prev.slice(0, 99)]); // Keep last 100 packets
        setTotalPackets(prev => prev + 1);
        setCaptureProgress(prev => (prev + 2) % 100);
      }, Math.random() * 1000 + 500); // Random interval between 500-1500ms
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCapturing]);

  const startCapture = () => {
    setIsCapturing(true);
    setPackets([]);
    setTotalPackets(0);
    setCaptureProgress(0);
  };

  const pauseCapture = () => {
    setIsCapturing(false);
  };

  const stopCapture = () => {
    setIsCapturing(false);
    setCaptureProgress(0);
  };

  return (
    <div className="min-h-screen bg-background network-grid">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-network bg-clip-text text-transparent">
              Packet Peek Tool
            </h1>
            <p className="text-muted-foreground">
              Real-time network packet analysis and protocol inspection
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />
              {totalPackets} packets captured
            </Badge>
            
            <div className="flex gap-2">
              {!isCapturing ? (
                <Button onClick={startCapture} className="bg-network-success hover:bg-network-success/80">
                  <Play className="w-4 h-4 mr-2" />
                  Start Capture
                </Button>
              ) : (
                <Button onClick={pauseCapture} variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button onClick={stopCapture} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>
        </div>

        {/* Capture Progress */}
        {isCapturing && (
          <Card className="p-4 glass-morphism">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Capturing packets...</span>
                  <span className="text-sm text-muted-foreground">{captureProgress}%</span>
                </div>
                <Progress value={captureProgress} className="h-2" />
              </div>
              <div className="packet-glow">
                <Network className="w-8 h-8 text-network-primary" />
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Packet List */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] glass-morphism">
              <Tabs defaultValue="packets" className="h-full">
                <div className="p-4 border-b border-border">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="packets" className="flex items-center gap-2">
                      <Network className="w-4 h-4" />
                      Packets
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Statistics
                    </TabsTrigger>
                    <TabsTrigger value="protocols" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Protocols
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="packets" className="h-full p-0">
                  <PacketList 
                    packets={packets} 
                    onSelectPacket={setSelectedPacket}
                    selectedPacket={selectedPacket}
                  />
                </TabsContent>
                
                <TabsContent value="stats" className="h-full p-4">
                  <NetworkStats packets={packets} />
                </TabsContent>
                
                <TabsContent value="protocols" className="h-full p-4">
                  <ProtocolAnalysis packets={packets} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Packet Details */}
          <div>
            <Card className="h-[600px] glass-morphism">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-network-primary" />
                  Packet Details
                </h3>
              </div>
              <div className="p-4 h-full overflow-auto">
                <PacketDetails packet={selectedPacket} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSniffer;