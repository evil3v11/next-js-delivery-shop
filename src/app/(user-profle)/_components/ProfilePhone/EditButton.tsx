import { Edit } from "lucide-react";

const EditButton = ({ setEditAction }: { setEditAction: () => void }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={setEditAction}
        className="bg-[#ff6633] hover:bg-[#ff6633]/80 text-white px-4 py-2 rounded cursor-pointer 
              duration-300 font-bold flex items-center"
      >
        <Edit className="h-4 w-4 mr-2" />
        Редактировать
      </button>
    </div>
  );
};

export default EditButton;
