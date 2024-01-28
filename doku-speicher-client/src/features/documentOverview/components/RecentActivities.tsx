import ActivityCard from "./ActivityCard";

const RecentActivities = () => {
  const numberOfActivities = 4;

  return (
    <div className="bg-lightBackground/35 h-[45%] p-5">
      <div className="flex flex-col gap-3">
        <p className="text-base font-semibold text-accentBlue">
          Recent Activities
        </p>
        {[...Array(numberOfActivities)].map((_, index) => (
          <ActivityCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
