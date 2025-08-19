import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { NetworkPacket } from "./NetworkSniffer";

interface PacketDetailsProps {
  packet: NetworkPacket | null;
}

export const PacketDetails = ({ packet }: PacketDetailsProps) => {
  if (!packet) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <div className="text-4xl">🔍</div>
          <p>Select a packet to view details</p>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      iso: date.toISOString()
    };
  };

  const time = formatTimestamp(packet.timestamp);

  // Mock detailed packet structure
  const packetStructure = {
    ethernet: {
      destination: "ff:ff:ff:ff:ff:ff",
      source: "aa:bb:cc:dd:ee:ff",
      type: "0x0800 (IPv4)"
    },
    ip: {
      version: "4",
      headerLength: "20 bytes",
      tos: "0x00",
      totalLength: packet.length,
      identification: "0x1234",
      flags: "0x4000 (Don't Fragment)",
      ttl: "64",
      protocol: packet.protocol,
      checksum: "0xabcd",
      source: packet.source,
      destination: packet.destination
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-network-primary">
            {packet.protocol}
          </Badge>
          <span className="text-sm text-muted-foreground">Packet #{packet.id.slice(-4)}</span>
        </div>
        <h4 className="font-medium">{packet.info}</h4>
      </div>

      <Separator />

      {/* Timestamp */}
      <Card className="p-3 bg-network-surface">
        <h5 className="font-medium mb-2">Timestamp</h5>
        <div className="space-y-1 text-sm font-mono">
          <div>Date: {time.date}</div>
          <div>Time: {time.time}</div>
          <div className="text-muted-foreground">ISO: {time.iso}</div>
        </div>
      </Card>

      {/* Addresses */}
      <Card className="p-3 bg-network-surface">
        <h5 className="font-medium mb-2">Network Addresses</h5>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Source:</span>
            <span className="text-network-primary">{packet.source}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Destination:</span>
            <span className="text-network-secondary">{packet.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Length:</span>
            <span>{packet.length} bytes</span>
          </div>
        </div>
      </Card>

      {/* Flags */}
      {packet.flags && (
        <Card className="p-3 bg-network-surface">
          <h5 className="font-medium mb-2">Flags</h5>
          <div className="flex gap-1">
            {packet.flags.map(flag => (
              <Badge key={flag} variant="outline" className="text-xs">
                {flag}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Ethernet Frame */}
      <Card className="p-3 bg-network-surface">
        <h5 className="font-medium mb-2">Ethernet Header</h5>
        <div className="space-y-1 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dst MAC:</span>
            <span>{packetStructure.ethernet.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Src MAC:</span>
            <span>{packetStructure.ethernet.source}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span>{packetStructure.ethernet.type}</span>
          </div>
        </div>
      </Card>

      {/* IP Header */}
      <Card className="p-3 bg-network-surface">
        <h5 className="font-medium mb-2">IP Header</h5>
        <div className="space-y-1 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version:</span>
            <span>{packetStructure.ip.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Header Length:</span>
            <span>{packetStructure.ip.headerLength}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">TTL:</span>
            <span>{packetStructure.ip.ttl}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Protocol:</span>
            <span className="text-network-primary">{packetStructure.ip.protocol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Checksum:</span>
            <span>{packetStructure.ip.checksum}</span>
          </div>
        </div>
      </Card>

      {/* Raw Data */}
      <Card className="p-3 bg-network-surface">
        <h5 className="font-medium mb-2">Raw Data</h5>
        <div className="text-sm font-mono text-muted-foreground break-all">
          {packet.data}
        </div>
      </Card>
    </div>
  );
};