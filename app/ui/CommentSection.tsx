
import { useState } from "react";
// import { addComment } from "../lib/actions";

export const comments = [
  {
    id: "1",
    author: "John Doe",
    time: "march 15 ,2023",
    content:
      "I really enjoyed reading this article! The insights provided were enlightening and thought-provoking. It's great to see such well-researched content. Looking forward to more from this author.",
    children: [
      {
        author: "Jane Smith",
        id: "2",
        time: "march 15 ,2023",
        content:
          "Thanks, John! I'm glad you found it interesting. Your feedback means a lot. Let me know if you have any questions or further thoughts on the topic.",
      },
    ],
  },
  {
    author: "Alice Johnson",
    id: "3",
    time: "march 15 ,2023",
    content:
      "This is a thought-provoking piece. The author raises important questions that challenge conventional wisdom. I appreciate the depth of analysis presented here. It's definitely worth further discussion.",
    children: [],
  },
  {
    author: "Bob Thompson",
    id: "4",
    time: "march 15 ,2023",
    content:
      "I disagree with some points, but overall a good read. The arguments presented are compelling, although I have reservations about certain conclusions. It's refreshing to engage with diverse perspectives.",
    children: [],
  },
];
export type Comments = {
  author: string;
  id: string;
  time: string;
  content: string;
  children: Replies[];
};
export type Replies = {
  author: string;
  id: string;
  time: string;
  content: string;
};
const Comment = ({ Comment }: { Comment: Comments }) => {
  const [doComment, setDoComment] = useState<Boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [children, setChildren] = useState<Replies[]>(Comment.children);
  console.log(comment)
  return (
    <div className=" p-4 mb-4 border-l-2 border-gray-300 text-gray-700">
      <div className="text-md font-semibold text-blue-500 flex items-center">
        {" "}
        <svg
          className="mx-2"
          height={20}
          width={20}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="#74C0FC"
            d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
          />
        </svg>
        {Comment.author}{" "}
        <span className=" text-gray-700 mx-2 font-normal">{Comment.time}</span>
      </div>
      <p className="p-2">{Comment.content}</p>
      <p
        className="flex text-blue-400"
        onClick={() => {
          setDoComment((prev) => !prev);
        }}
      >
        <svg
          className="mx-2"
          height={18}
          width={18}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="#74C0FC"
            d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"
          />
        </svg>
        Reply
      </p>
      {doComment && (
        <>
          <textarea
            color="primary"

          className="mt-2 mb-2 outline-none rounded-lg  p-4 bg-gray-300 text-gray-800 w-full"
            placeholder="Enter your description"
            rows={3}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          ></textarea>
          <div className="p-2">
            <button
              className="mx-4 bg-gray-700 text-white rounded-md px-4 py-2"
              onClick={() => {
                setChildren((prev) => {
                  return [
                    ...prev,
                    {
                      author: "hunter",
                      id: "65",
                      content: comment,
                      time: "march 15,2023",
                      children: [],
                    },
                  ];
                });
                setDoComment(false);
              }}
            >
              submit
            </button>
            <button
              className="mx-4 bg-gray-700 text-white rounded-md px-4 py-2"
              onClick={() => {
                setDoComment(false);
              }}
            >
              {" "}
              cancel
            </button>
          </div>
        </>
      )}
      {children && children.length > 0 && (
        <div className="ml-4 mt-2">
          {children.map((child, index) => (
            <div key={index}>
              <div className="text-md font-semibold text-blue-500 flex items-center">
                {" "}
                <svg
                  className="mx-2"
                  height={20}
                  width={20}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="#74C0FC"
                    d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                  />
                </svg>
                {child.author}{" "}
                <span className=" text-gray-700 mx-2 font-normal">
                  {child.time}
                </span>
              </div>
              <p className="p-2">{child.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default function CommentSection({ comments ,authorId , codeId }: { comments: Comments[] ,authorId:string,codeId:number }) {
  const [comment, setComment] = useState<string>("");
  const [commentsState, setCommentsState] = useState<Comments[]>(comments);
  console.log(comments);
  return (
    <div>
      {commentsState.map((comment, index) => (
        <Comment Comment={comment} />
      ))}
      <div className="mt-10 p-2">

      <label htmlFor="commentArea"
       className="text-gray-700 font-bold">Add your comment</label>
        <textarea
          id="commentArea"
          className=" mb-2 outline-none rounded-lg bg-gray-300 p-4 text-gray-700 w-full"
          placeholder="Enter your description"
          onChange={(e) => {
            setComment(e.target.value);
          }}
          rows={5}
          // cols={45}
          value={comment}
        >
        </textarea>
        <button
          onClick={async () => {
            comment 
            // && await addComment(authorId,codeId,comment,"march 23")
            comment &&
              setCommentsState((prev) => {
                return [
                  ...prev,
                  {
                    author: "hunter",
                    id: "65",
                    content: comment,
                    time: "march 15,2023",
                    children: [],
                  },
                ];
              });
            setComment("");
          }}
          className="mx-4 bg-gray-700 px-3 py-2 text-white rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
}