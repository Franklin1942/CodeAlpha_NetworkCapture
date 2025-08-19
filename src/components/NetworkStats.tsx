import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NetworkPacket } from "./NetworkSniffer";
import { Activity, TrendingUp, Shield, Zap } from "lucide-react";

interface NetworkStatsProps {
  packets: NetworkPacket[];
}

export const NetworkStats = ({ packets }: NetworkStatsProps) => {
  // Calculate statistics
  const protocolCounts = packets.reduce((acc, packet) => {
    acc[packet.protocol] = (acc[packet.protocol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalBytes = packets.reduce((sum, packet) => sum + packet.length, 0);
  const averagePacketSize = packets.length > 0 ? Math.round(totalBytes / packets.length) : 0;

  const topSources = packets.reduce((acc, packet) => {
    acc[packet.source] = (acc[packet.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDestinations = packets.reduce((acc, packet) => {
    acc[packet.destination] = (acc[packet.destination] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const protocolEntries = Object.entries(protocolCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const sourceEntries = Object.entries(topSources)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const destinationEntries = Object.entries(topDestinations)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-network-surface">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-network-primary/20 rounded-lg">
              <Activity className="w-4 h-4 text-network-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Packets</p>
              <p className="text-2xl font-bold">{packets.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-network-surface">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-network-secondary/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-network-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Data</p>
              <p className="text-2xl font-bold">{formatBytes(totalBytes)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-network-surface">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-network-success/20 rounded-lg">
              <Zap className="w-4 h-4 text-network-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Size</p>
              <p className="text-2xl font-bold">{averagePacketSize}B</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-network-surface">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-network-warning/20 rounded-lg">
              <Shield className="w-4 h-4 text-network-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Protocols</p>
              <p className="text-2xl font-bold">{Object.keys(protocolCounts).length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Protocol Distribution */}
      <Card className="p-4 bg-network-surface">
        <h4 className="font-medium mb-4">Protocol Distribution</h4>
        <div className="space-y-3">
          {protocolEntries.map(([protocol, count]) => {
            const percentage = Math.round((count / packets.length) * 100);
            return (
              <div key={protocol} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-mono">{protocol}</span>
                  <span className="text-muted-foreground">{count} packets ({percentage}%)</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Top Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-network-surface">
          <h4 className="font-medium mb-4">Top Source IPs</h4>
          <div className="space-y-2">
            {sourceEntries.map(([ip, count]) => (
              <div key={ip} className="flex justify-between text-sm font-mono">
                <span className="text-network-primary">{ip}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-network-surface">
          <h4 className="font-medium mb-4">Top Destination IPs</h4>
          <div className="space-y-2">
            {destinationEntries.map(([ip, count]) => (
              <div key={ip} className="flex justify-between text-sm font-mono">
                <span className="text-network-secondary">{ip}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};