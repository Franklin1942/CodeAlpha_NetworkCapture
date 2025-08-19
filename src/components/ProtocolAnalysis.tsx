import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NetworkPacket } from "./NetworkSniffer";
import { Shield, Lock, Globe, Server, Wifi, AlertTriangle } from "lucide-react";

interface ProtocolAnalysisProps {
  packets: NetworkPacket[];
}

export const ProtocolAnalysis = ({ packets }: ProtocolAnalysisProps) => {
  const protocols = {
    HTTP: {
      description: "Hypertext Transfer Protocol - Unencrypted web traffic",
      icon: Globe,
      security: "low",
      port: "80",
      encrypted: false
    },
    HTTPS: {
      description: "Secure HTTP with TLS/SSL encryption",
      icon: Lock,
      security: "high",
      port: "443",
      encrypted: true
    },
    TCP: {
      description: "Transmission Control Protocol - Reliable connection",
      icon: Server,
      security: "medium",
      port: "Various",
      encrypted: false
    },
    UDP: {
      description: "User Datagram Protocol - Fast, connectionless",
      icon: Wifi,
      security: "medium",
      port: "Various",
      encrypted: false
    },
    DNS: {
      description: "Domain Name System - Name resolution",
      icon: Globe,
      security: "medium",
      port: "53",
      encrypted: false
    },
    ARP: {
      description: "Address Resolution Protocol - MAC address mapping",
      icon: Shield,
      security: "low",
      port: "N/A",
      encrypted: false
    },
    ICMP: {
      description: "Internet Control Message Protocol - Network diagnostics",
      icon: AlertTriangle,
      security: "low",
      port: "N/A",
      encrypted: false
    }
  };

  const protocolCounts = packets.reduce((acc, packet) => {
    acc[packet.protocol] = (acc[packet.protocol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const protocolEntries = Object.entries(protocolCounts)
    .sort(([,a], [,b]) => b - a);

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-network-success text-white';
      case 'medium': return 'bg-network-warning text-black';
      case 'low': return 'bg-network-danger text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const encryptedCount = packets.filter(p => protocols[p.protocol as keyof typeof protocols]?.encrypted).length;
  const encryptionPercentage = packets.length > 0 ? Math.round((encryptedCount / packets.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card className="p-4 bg-network-surface">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security Overview
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Encrypted Traffic</span>
            <span className="text-sm font-mono">{encryptedCount}/{packets.length} packets</span>
          </div>
          <Progress value={encryptionPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {encryptionPercentage}% of traffic is encrypted
          </p>
        </div>
      </Card>

      {/* Protocol Details */}
      <div className="space-y-4">
        {protocolEntries.map(([protocol, count]) => {
          const info = protocols[protocol as keyof typeof protocols];
          const percentage = Math.round((count / packets.length) * 100);
          const IconComponent = info?.icon || Shield;

          return (
            <Card key={protocol} className="p-4 bg-network-surface">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-network-primary/20 rounded-lg">
                  <IconComponent className="w-5 h-5 text-network-primary" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h5 className="font-medium">{protocol}</h5>
                      {info && (
                        <Badge className={getSecurityColor(info.security)}>
                          {info.security} security
                        </Badge>
                      )}
                      {info?.encrypted && (
                        <Badge className="bg-network-success">
                          <Lock className="w-3 h-3 mr-1" />
                          Encrypted
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{count} packets</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                  </div>
                  
                  {info && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-muted-foreground">
                          Port: <span className="font-mono">{info.port}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Encryption: <span className="font-mono">{info.encrypted ? 'Yes' : 'No'}</span>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Progress value={percentage} className="h-1" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Security Recommendations */}
      <Card className="p-4 bg-network-surface border-network-warning">
        <h4 className="font-medium mb-4 flex items-center gap-2 text-network-warning">
          <AlertTriangle className="w-4 h-4" />
          Security Recommendations
        </h4>
        <ul className="space-y-2 text-sm">
          {encryptionPercentage < 50 && (
            <li className="flex items-start gap-2">
              <span className="text-network-danger">•</span>
              <span>Consider using HTTPS instead of HTTP for web traffic</span>
            </li>
          )}
          {protocolCounts.ARP > 0 && (
            <li className="flex items-start gap-2">
              <span className="text-network-warning">•</span>
              <span>Monitor ARP traffic for potential spoofing attacks</span>
            </li>
          )}
          {protocolCounts.DNS > 0 && (
            <li className="flex items-start gap-2">
              <span className="text-network-warning">•</span>
              <span>Consider using DNS over HTTPS (DoH) for encrypted name resolution</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-network-success">•</span>
            <span>Regular packet analysis helps identify security vulnerabilities</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};