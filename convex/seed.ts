import { mutation } from "./_generated/server";

export const seed = mutation({
  handler: async (ctx) => {
    // Check if we already have topics to avoid duplicate seeding
    const existingTopics = await ctx.db.query("topics").collect();
    if (existingTopics.length > 0) {
      return { success: false, message: "Database already seeded" };
    }

    // Create topics
    const topics = [
      {
        name: "MMA",
        description: "Mixed Martial Arts discussions, UFC events, and fighter analysis",
        icon: "trending-up",
        color: "border-red-500",
        threadCount: 0,
        lastPostAt: Date.now(),
      },
      {
        name: "Brazilian Jiu-Jitsu",
        description: "BJJ techniques, competitions, belt progression, and training",
        icon: "shield",
        color: "border-blue-500",
        threadCount: 0,
        lastPostAt: Date.now(),
      },
      {
        name: "Boxing",
        description: "Boxing techniques, professional bouts, training methods, and equipment",
        icon: "dumbbell",
        color: "border-yellow-500",
        threadCount: 0,
        lastPostAt: Date.now(),
      },
      {
        name: "Taekwondo",
        description: "Taekwondo forms, competitions, belt advancement, and training",
        icon: "flame",
        color: "border-green-500",
        threadCount: 0,
        lastPostAt: Date.now(),
      },
      {
        name: "Judo",
        description: "Judo throws, competitions, training methods, and philosophy",
        icon: "users",
        color: "border-purple-500",
        threadCount: 0,
        lastPostAt: Date.now(),
      },
      {
        name: "Karate",
        description: "Various Karate styles, kata, kumite, and dojo training",
        icon: "award",
        color: "border-orange-500",
        threadCount: 0,
        lastPostAt: Date.now(),
      },
      {
        name: "Muay Thai",
        description: "Muay Thai techniques, fights, training camps, and equipment",
        icon: "swords",
        color: "border-pink-500",
        threadCount: 0,
        lastPostAt: Date.now(),
      },
      {
        name: "Wrestling",
        description: "Freestyle and Greco-Roman wrestling, techniques, and competitions",
        icon: "users",
        color: "border-indigo-500",
        threadCount: 0,
        lastPostAt: Date.now(),
      },
    ];

    const topicIds = [];
    for (const topic of topics) {
      const topicId = await ctx.db.insert("topics", topic);
      topicIds.push(topicId);
    }

    // Create sample users
    const users = [
      {
        userId: "sample-user-1",
        username: "MartialArtist42",
        bio: "Passionate about martial arts for over 5 years",
        joinedAt: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
        postCount: 0,
        role: "user",
        lastActiveAt: Date.now(),
      },
      {
        userId: "sample-user-2",
        username: "BlackBelt2023",
        bio: "BJJ black belt and MMA enthusiast",
        joinedAt: Date.now() - 180 * 24 * 60 * 60 * 1000, // 180 days ago
        postCount: 0,
        role: "moderator",
        lastActiveAt: Date.now(),
      },
      {
        userId: "sample-user-3",
        username: "CoachMike",
        bio: "Professional martial arts coach with 15+ years of experience",
        joinedAt: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
        postCount: 0,
        role: "admin",
        lastActiveAt: Date.now(),
      },
    ];

    for (const user of users) {
      await ctx.db.insert("userProfiles", user);
    }

    // Create sample threads and replies for each topic
    for (const topicId of topicIds) {
      const topic = await ctx.db.get(topicId);
      if (!topic) continue;

      // Create 3-5 threads per topic
      const threadCount = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < threadCount; i++) {
        const authorIndex = Math.floor(Math.random() * users.length);
        const author = users[authorIndex];
        
        const threadTitle = getRandomThreadTitle(topic.name);
        const threadContent = getRandomThreadContent(topic.name);
        
        const threadId = await ctx.db.insert("threads", {
          title: threadTitle,
          content: threadContent,
          topicId,
          authorId: author.userId,
          authorName: author.username,
          authorImageUrl: `/placeholder.svg?height=40&width=40`,
          views: Math.floor(Math.random() * 200) + 50,
          likes: Math.floor(Math.random() * 30),
          replyCount: 0,
          createdAt: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Up to 7 days ago
          isPinned: i === 0 && Math.random() > 0.7, // Randomly pin the first thread sometimes
          isLocked: false,
        });

        // Update topic thread count
        await ctx.db.patch(topicId, {
          threadCount: (topic.threadCount || 0) + 1,
          lastPostAt: Date.now(),
        });

        // Create 2-6 replies per thread
        const replyCount = Math.floor(Math.random() * 5) + 2;
        for (let j = 0; j < replyCount; j++) {
          const replyAuthorIndex = Math.floor(Math.random() * users.length);
          const replyAuthor = users[replyAuthorIndex];
          
          const replyContent = getRandomReplyContent(topic.name);
          
          await ctx.db.insert("replies", {
            threadId,
            content: replyContent,
            authorId: replyAuthor.userId,
            authorName: replyAuthor.username,
            authorImageUrl: `/placeholder.svg?height=40&width=40`,
            likes: Math.floor(Math.random() * 15),
            createdAt: Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000), // Up to 3 days ago
            isDeleted: false,
          });

          // Update thread reply count
          const thread = await ctx.db.get(threadId);
          if (thread) {
            await ctx.db.patch(threadId, {
              replyCount: (thread.replyCount || 0) + 1,
              updatedAt: Date.now(),
            });
          }
        }
      }
    }

    return { success: true, message: "Database seeded successfully" };
  },
});

// Helper functions to generate random content
function getRandomThreadTitle(topicName: string): string {
  const titles = [
    `Best ${topicName} techniques for beginners`,
    `${topicName} competition preparation tips`,
    `Recommended ${topicName} schools in New York`,
    `${topicName} vs Traditional Karate - Differences and Similarities`,
    `Dealing with injuries in ${topicName}`,
    `How to improve your ${topicName} skills quickly`,
    `${topicName} training routine for busy professionals`,
    `Essential equipment for ${topicName} practitioners`,
    `Famous ${topicName} fighters and their techniques`,
    `${topicName} for self-defense: What works and what doesn't`,
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomThreadContent(topicName: string): string {
  const contents = [
    `<p>I've been practicing ${topicName} for about 3 months now and I'm looking for advice on the most effective techniques to focus on as a beginner.</p>
    <p>My instructor has been teaching us a variety of moves, but I want to know which ones I should prioritize in my personal practice time. I'm particularly interested in techniques that:</p>
    <ul>
      <li>Build a solid foundation for more advanced moves</li>
      <li>Are practical for self-defense situations</li>
      <li>Help develop proper form and body mechanics</li>
    </ul>
    <p>Any advice from more experienced practitioners would be greatly appreciated!</p>`,
    
    `<p>I have my first ${topicName} competition coming up in a month. What should I focus on in my training?</p>
    <p>I've been training for about a year now, and while I feel confident in my skills during regular practice, I'm nervous about competing. I'd appreciate any advice on:</p>
    <ul>
      <li>Pre-competition training routines</li>
      <li>Mental preparation strategies</li>
      <li>Competition day tips</li>
      <li>Common mistakes to avoid</li>
    </ul>
    <p>Thanks in advance for your help!</p>`,
    
    `<p>I'm looking to improve my ${topicName} conditioning. What exercises do you recommend?</p>
    <p>I've noticed that I get tired quickly during longer training sessions, and I want to improve my stamina and strength specifically for ${topicName}. I have access to a regular gym as well as my ${topicName} school.</p>
    <p>What exercises have you found most beneficial for improving performance in ${topicName}?</p>`,
  ];
  
  return contents[Math.floor(Math.random() * contents.length)];
}

function getRandomReplyContent(topicName: string): string {
  const replies = [
    `<p>Welcome to the world of ${topicName}! As someone who's been practicing for over 10 years, I'd recommend focusing on these fundamentals:</p>
    <ol>
      <li><strong>Proper stance and balance</strong> - This is the foundation of everything in ${topicName}. Without good balance, even the best techniques will fail.</li>
      <li><strong>Basic footwork</strong> - Learning how to move efficiently is crucial before adding complex techniques.</li>
      <li><strong>Core strengthening exercises</strong> - A strong core will improve all your techniques and help prevent injuries.</li>
    </ol>
    <p>Don't rush to learn flashy moves. Master the basics first, and everything else will come more naturally.</p>`,
    
    `<p>I've been teaching ${topicName} for 15 years, and I always tell my beginners to focus on consistency over complexity.</p>
    <p>Practice these fundamental techniques daily:</p>
    <ul>
      <li>Basic blocks - They're not glamorous, but they'll save you in real situations</li>
      <li>Proper breathing techniques - Often overlooked but critical for power generation</li>
      <li>Simple strikes - Master straight punches before moving to hooks and uppercuts</li>
    </ul>
    <p>Also, don't neglect flexibility training. It will prevent injuries and improve your range of motion for techniques.</p>`,
    
    `<p>In my experience with ${topicName}, the most important thing is to train with purpose. Don't just go through the motions.</p>
    <p>Every time you practice a technique, think about:</p>
    <ul>
      <li>The mechanics behind the movement</li>
      <li>How you would apply it in a real situation</li>
      <li>What could go wrong and how to adjust</li>
    </ul>
    <p>This mindful approach will accelerate your progress much faster than mindless repetition.</p>`,
    
    `<p>I started ${topicName} about 2 years ago, and here's what helped me improve quickly:</p>
    <ol>
      <li>Record yourself training and analyze your form</li>
      <li>Train with different partners to adapt to various body types and styles</li>
      <li>Supplement your training with specific strength and conditioning exercises</li>
      <li>Study videos of high-level practitioners and competitions</li>
    </ol>
    <p>Hope this helps! Stick with it and you'll see progress.</p>`,
  ];
  
  return replies[Math.floor(Math.random() * replies.length)];
}