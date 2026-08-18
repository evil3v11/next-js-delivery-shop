import { stats } from "../_utils/stats";

const StatsSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">
      Общая статистика
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((_, i) => (
        <div key={i} className="p-4 rounded-lg border border-gray-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default StatsSkeleton;
