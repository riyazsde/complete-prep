export default function OptionBoxGrid({
  items,
  selectedId,
  onToggle,
  name,
  titleRender,
  descriptionRender,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 rounded-xl">
      {items?.map((option) => (
        <label
          key={option?._id}
          className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer hover:shadow transition bg-white border ${
            selectedId === option._id ? "border-black" : "border-gray-200"
          }`}
        >
          <div>
            <div className="font-medium text-black">
              {titleRender ? titleRender(option) : option.name}
            </div>
            <div className="text-sm text-gray-500">
              {descriptionRender
                ? descriptionRender(option)
                : option.description?.slice(0, 100)}
            </div>
          </div>
          <input
            type="radio"
            name={name}
            className="w-5 h-5 text-lime-500 border-gray-300 focus:ring-2 focus:ring-lime-500"
            checked={selectedId === option._id}
            onChange={() => onToggle(option._id)}
          />
        </label>
      ))}
    </div>
  );
}
