import Header from "./_components/HeaderCMS";
import DashboardCardsGrid from "./_components/DashboardCardsGrid";
import StatsSection from "./_components/StatsSection";

const CMSMainPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <Header
          title="Административная панель"
          description="Управление контентом и SEO блога"
        />
        <DashboardCardsGrid />
        <StatsSection />
      </div>
    </div>
  );
};

export default CMSMainPage;
