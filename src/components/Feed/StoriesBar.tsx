import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoriesBar: React.FC = () => {
  const {
    stories,
    currentUser,
    openStoryViewer,
    setIsCreateModalOpen,
    setCreateModalInitialType,
  } = useApp();

  const handleAddStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreateModalInitialType('story');
    setIsCreateModalOpen(true);
  };

  const userStory = stories.find((s) => s.userId === currentUser.id);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-1 border-b border-zinc-900 bg-black">
      <div className="flex items-center gap-4 min-w-max">
        {/* User Story / Add Story button */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div
            className="relative"
            onClick={() => {
              if (userStory) {
                const idx = stories.findIndex((s) => s.id === userStory.id);
                if (idx !== -1) openStoryViewer(idx);
              } else {
                setCreateModalInitialType('story');
                setIsCreateModalOpen(true);
              }
            }}
          >
            <div
              className={`w-16 h-16 rounded-full p-[2.5px] ${
                userStory
                  ? 'insta-gradient-border'
                  : 'border border-zinc-700 group-hover:border-zinc-500'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 p-[1.5px]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Plus badge */}
            <button
              onClick={handleAddStory}
              className="absolute bottom-0 right-0 w-5 h-5 bg-pink-600 text-white rounded-full flex items-center justify-center border-2 border-black hover:bg-pink-500 hover:scale-110 active:scale-95 transition-all shadow-md"
              title="Add Story"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <span className="text-[11px] text-zinc-300 font-medium max-w-[68px] truncate text-center">
            Your story
          </span>
        </div>

        {/* Other users' stories */}
        {stories
          .filter((story) => story.userId !== currentUser.id)
          .map((story, index) => {
            const actualIndex = stories.findIndex((s) => s.id === story.id);
            return (
              <div
                key={story.id}
                onClick={() => openStoryViewer(actualIndex)}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <div
                  className={`w-16 h-16 rounded-full p-[2.5px] transition-transform group-hover:scale-105 ${
                    story.seen ? 'border-2 border-zinc-700' : 'insta-gradient-border shadow-md shadow-pink-950/20'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-black p-[1.5px]">
                    <img
                      src={story.userAvatar}
                      alt={story.username}
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <span className="text-[11px] text-zinc-300 font-medium max-w-[68px] truncate text-center">
                  {story.username}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
