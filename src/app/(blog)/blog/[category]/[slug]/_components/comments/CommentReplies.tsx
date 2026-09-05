import { Activity, useState } from "react";

import { getReplyWord } from "../../../_utils/getReplyWord";

import { CommentRepliesProps } from "@/app/(blog)/blog/_types";

import { ChevronDown, ChevronUp } from "lucide-react";
import CommentItem from "./CommentItem";

const CommentReplies = ({
  replies,
  articleId,
  depth,
}: CommentRepliesProps) => {
  const [showReplies, setShowReplies] = useState(false);

  if (!replies.length) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowReplies(!showReplies)}
        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 mb-2 cursor-pointer duration-300"
      >
        {showReplies ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span>
          {replies.length} {getReplyWord(replies.length)}
        </span>
      </button>
      <Activity mode={showReplies ? "visible" : "hidden"}>
        <div className="space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              articleId={articleId}
              depth={depth + 1}
            />
          ))}
        </div>
      </Activity>
    </div>
  );
};
export default CommentReplies;
