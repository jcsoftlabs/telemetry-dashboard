interface WebSocketStatusProps {
    connected: boolean;
    reconnecting: boolean;
}

export default function WebSocketStatus({ connected, reconnecting }: WebSocketStatusProps) {
    if (reconnecting) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse animation-delay-150" />
                    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse animation-delay-300" />
                </div>
                <span className="text-sm font-medium text-yellow-700">Reconnexion en cours...</span>
            </div>
        );
    }

    if (!connected) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
                <div className="h-2 w-2 bg-red-500 rounded-full" />
                <span className="text-sm font-medium text-red-700">Déconnecté du temps réel</span>
            </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">🔴 Temps réel actif</span>
        </div>
    );
}
