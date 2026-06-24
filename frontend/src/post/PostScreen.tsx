const PostScreen = () => {
    const demoPost = {
        postId: "32432r32re",
        authorId: "32432r32re",
        title: "Elden ring",
        slug: "elden-ring",
        description: "Elden ring is a great game, here's why!",
        categoryId: "fdsfdsfds",
        createdAt: "July 24th, 2026",
        updatedAt: "fdsfdsfds",
        authorName: "Tarnished",
        categoryName: "Games",
        content: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. In finibus facilisis nisi, nec fringilla quam mattis at. Cras aliquet tempor ultricies. Cras in lorem sed sapien placerat placerat. Integer convallis, velit eget semper rhoncus, dolor magna lobortis justo, non sagittis turpis est ac risus. Donec sagittis dolor odio, sit amet congue lacus mollis non. Nulla dictum ex ac scelerisque mollis. Donec iaculis arcu nec sapien cursus, vitae luctus lorem facilisis. Mauris rutrum, nunc vitae volutpat semper, risus est ultrices turpis, et porta sapien nisi eu justo. Mauris molestie finibus est, vitae rutrum dui finibus eget. Donec et sapien at ex semper blandit. Praesent et ipsum nec dui venenatis condimentum vel in augue. Morbi quis nibh egestas, dapibus elit ut, semper magna. Curabitur ligula nibh, tempor eu vestibulum at, rutrum id sem. Maecenas malesuada risus eget ipsum rhoncus maximus. Mauris ante ipsum, rhoncus vel ornare id, consectetur quis magna.

Etiam tristique, neque non accumsan suscipit, metus libero aliquam risus, ut porttitor lectus sapien a felis. Vestibulum laoreet gravida leo vitae aliquet. Suspendisse dictum eu nunc ac molestie. Aliquam cursus nisi elit, quis laoreet est mattis vel. Vestibulum maximus tempor auctor. Aenean quis lectus lorem. Mauris euismod velit quam, a porta quam feugiat sed. Morbi ultrices ultrices nisi posuere tristique. Pellentesque in hendrerit magna. Morbi risus diam, consequat a diam id, vulputate imperdiet tellus. Vivamus eu interdum tellus. Aliquam vel scelerisque turpis. Curabitur ut hendrerit magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;

Proin sollicitudin rutrum lorem, ac varius nunc venenatis vel. Integer sed venenatis augue, sit amet semper arcu. Mauris ultrices, eros et molestie finibus, enim risus bibendum diam, at sagittis tellus metus ullamcorper eros. Praesent lobortis ligula nec lectus laoreet pharetra at condimentum augue. Etiam pulvinar orci mi, et suscipit justo rutrum pulvinar. Aenean dolor felis, sagittis et neque ut, placerat blandit dolor. Morbi vulputate, nibh sed gravida volutpat, arcu nulla aliquet nibh, posuere imperdiet mi ligula ac eros. Suspendisse potenti. Duis eget nibh eget sem viverra maximus eget non quam.

Donec vitae diam lacus. Maecenas facilisis sagittis mauris quis euismod. Nam eget sodales turpis, eu dignissim ipsum. Sed mollis viverra nunc. Maecenas sed ante vel enim rhoncus cursus. Vestibulum non accumsan sem. Etiam quis sem id nulla tempor aliquam at sit amet leo. Proin id vulputate augue, vel mollis arcu. Vestibulum auctor purus eros, eu mollis felis luctus eget. Aliquam fermentum, mi in posuere varius, nulla ex ultricies mauris, quis placerat augue nisl non urna. Pellentesque gravida erat neque, sed fermentum lorem elementum id. Cras mollis, arcu a ultrices lacinia, libero diam commodo augue, at auctor ipsum lacus eu arcu. Curabitur sit amet condimentum lacus. Aliquam volutpat porta justo in sodales. Nunc ut augue libero.

Praesent in purus at risus luctus fermentum. Cras aliquet lacinia turpis, vel dignissim mi luctus et. Nulla at facilisis metus. Curabitur vitae accumsan quam, eu dapibus purus. Duis auctor nisl a lectus lacinia laoreet. Donec auctor quam id rutrum volutpat. Quisque sit amet turpis scelerisque, dignissim nisi id, ornare augue. Etiam semper massa sed mauris sollicitudin, in aliquet nibh facilisis. Ut ut libero rhoncus, lacinia metus quis, accumsan purus. In at libero ipsum.`,
        likes: 69,
    }
    const { title, content, authorName, createdAt } = demoPost;
    return (
        <div className="py-10 px-60 w-full h-full flex flex-col gap-2">
            <div className="text-[#edf2f4] text-[64px] font-bold">{title}</div>
            <div className="w-full gap-4 flex items-center text-[#e9ecef] italic">
                <div>{`By ${authorName}`}</div>
                <div>{createdAt}</div>
            </div>
            <div className="my-10 text-[#dee2e6] text-[24px] break-words font-serif whitespace-pre-line">
                {content}
            </div>
        </div >
    );
}
export default PostScreen;
