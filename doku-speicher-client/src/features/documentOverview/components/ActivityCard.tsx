const ActivityCard = () => {
  return (
    <div className="w-full h-[60px] bg-lightBackground rounded-lg flex items-center">
      <div className="h-[40px] w-[40px]  rounded-full m-4">
        <img src="src/assets/sample.jpg" className="rounded-full" alt="" />
      </div>
      <div>
        <p className="text-sm font-semibold break-all ">
          Ayodeji Shared a File
        </p>
        <p className="text-xs break-all italic">2024-01-25 23:47:48</p>
      </div>
    </div>
  );
};

export default ActivityCard;
