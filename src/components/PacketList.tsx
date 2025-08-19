import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { NetworkPacket } from "./NetworkSniffer";

interface PacketListProps {
  packets: NetworkPacket[];
  onSelectPacket: (packet: NetworkPacket) => void;
  selectedPacket: NetworkPacket | null;
}

const getProtocolColor = (protocol: string) => {
  const colors = {
    HTTP: 'bg-network-success',
    HTTPS: 'bg-network-primary',
    TCP: 'bg-network-secondary',
    UDP: 'bg-network-warning',
    DNS: 'bg-purple-500',
    ARP: 'bg-orange-500',
    ICMP: 'bg-network-danger'
  };
  return colors[protocol as keyof typeof colors] || 'bg-gray-500';
};

export const PacketList = ({ packets, onSelectPacket, selectedPacket }: PacketListProps) => {
  if (packets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <div className="text-4xl">📡</div>
          <p>No packets captured yet</p>
          <p className="text-sm">Start capturing to see network traffic</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-4">
        {packets.map((packet, index) => (
          <div
            key={packet.id}
            onClick={() => onSelectPacket(packet)}
            className={cn(
              "grid grid-cols-12 gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-network-surface text-sm font-mono",
              selectedPacket?.id === packet.id 
                ? "bg-network-surface border-network-primary shadow-network" 
                : "border-border hover:border-network-primary/50"
            )}
          >
            <div className="col-span-1 text-muted-foreground">
              #{(index + 1).toString().padStart(3, '0')}
            </div>
            
            <div className="col-span-2">
              <Badge className={cn("text-xs", getProtocolColor(packet.protocol))}>
                {packet.protocol}
              </Badge>
            </div>
            
            <div className="col-span-3 text-network-primary">
              {packet.source}
            </div>
            
            <div className="col-span-1 text-center text-muted-foreground">
              →
            </div>
            
            <div className="col-span-3 text-network-secondary">
              {packet.destination}
            </div>
            
            <div className="col-span-1 text-right text-muted-foreground">
              {packet.length}B
            </div>
            
            <div className="col-span-1 text-right text-xs text-muted-foreground">
              {new Date(packet.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};