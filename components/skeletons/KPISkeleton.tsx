export default function KPISkeleton() {
    return (
        <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
            </div>

            <div className="h-10 bg-gray-300 rounded w-20"></div>
        </div>
    );
}
