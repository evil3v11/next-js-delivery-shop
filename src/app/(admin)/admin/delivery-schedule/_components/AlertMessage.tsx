const MessageAlert = ({ message }: { message: string }): React.JSX.Element => {
  return (
    <div className="p-3 md:p-4 mb-4 rounded border bg-[#e5ffde] text-[#008c49]">
      {message}
    </div>
  );
};

export default MessageAlert;
