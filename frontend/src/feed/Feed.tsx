import FeedPost from "./components/FeedPost";

const FeedScreen = () => {
    const demoPost = {
        postId: "32432r32re",
        authorId: "32432r32re",
        title: "Elden ring",
        slug: "elden-ring",
        description: "Elden ring is a great game, here's why!",
        categoryId: "fdsfdsfds",
        createdAt: "fdsfdsfds",
        updatedAt: "fdsfdsfds",
        authorName: "Tarnished",
        categoryName: "Games",
        likes: 69,
    }
    return (
        <div className="flex p-8 justify-center flex-wrap gap-8 overflow-y-auto content-start w-screen h-full">
            <FeedPost post={demoPost} />
            <FeedPost post={demoPost} />
            <FeedPost post={demoPost} />
            <FeedPost post={demoPost} />
            <FeedPost post={demoPost} />
            <FeedPost post={demoPost} />
            <FeedPost post={demoPost} />
            <FeedPost post={demoPost} />
            <FeedPost post={demoPost} />

        </div>);
}
export default FeedScreen;
