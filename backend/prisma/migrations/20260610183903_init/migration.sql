-- CreateTable
CREATE TABLE "AppSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "adminCode" TEXT NOT NULL DEFAULT 'ADMIN2026',

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Queen of Queens',
    "title" TEXT NOT NULL DEFAULT 'QUEEN OF QUEENS — SLAYER OF THE STAGE!',
    "totalContestants" INTEGER NOT NULL DEFAULT 28,
    "heats" INTEGER NOT NULL DEFAULT 7,
    "contestantsPerHeat" INTEGER NOT NULL DEFAULT 4,
    "songsPerContestant" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "venue" TEXT NOT NULL DEFAULT '',
    "scoringLocked" BOOLEAN NOT NULL DEFAULT false,
    "guestVotingLocked" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "roundKey" TEXT,
    "roundType" TEXT,
    "stage" TEXT,
    "expectedContestants" INTEGER NOT NULL DEFAULT 0,
    "songCount" INTEGER NOT NULL DEFAULT 3,
    "advanceCount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contestant" (
    "id" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "style" TEXT NOT NULL DEFAULT 'Heat Performance',
    "notes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Contestant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventContestant" (
    "eventId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "style" TEXT NOT NULL DEFAULT 'Heat Performance',
    "notes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EventContestant_pkey" PRIMARY KEY ("eventId","contestantId")
);

-- CreateTable
CREATE TABLE "Judge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Judge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventJudge" (
    "eventId" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,

    CONSTRAINT "EventJudge_pkey" PRIMARY KEY ("eventId","judgeId")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GuestCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "judgeId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreValue" (
    "scoreId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "ScoreValue_pkey" PRIMARY KEY ("scoreId","categoryId")
);

-- CreateTable
CREATE TABLE "GuestVote" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "voterToken" TEXT NOT NULL,
    "voterName" TEXT NOT NULL DEFAULT 'Anonymous',
    "anonymous" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestVoteChoice" (
    "guestVoteId" TEXT NOT NULL,
    "guestCategoryId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,

    CONSTRAINT "GuestVoteChoice_pkey" PRIMARY KEY ("guestVoteId","guestCategoryId")
);

-- CreateTable
CREATE TABLE "EventWinner" (
    "eventId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "EventWinner_pkey" PRIMARY KEY ("eventId","contestantId","type")
);

-- CreateIndex
CREATE UNIQUE INDEX "Judge_code_key" ON "Judge"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Score_eventId_judgeId_contestantId_key" ON "Score"("eventId", "judgeId", "contestantId");

-- CreateIndex
CREATE UNIQUE INDEX "GuestVote_eventId_voterToken_key" ON "GuestVote"("eventId", "voterToken");

-- AddForeignKey
ALTER TABLE "EventContestant" ADD CONSTRAINT "EventContestant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventContestant" ADD CONSTRAINT "EventContestant_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "Contestant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventJudge" ADD CONSTRAINT "EventJudge_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventJudge" ADD CONSTRAINT "EventJudge_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "Judge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_judgeId_fkey" FOREIGN KEY ("judgeId") REFERENCES "Judge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "Contestant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreValue" ADD CONSTRAINT "ScoreValue_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreValue" ADD CONSTRAINT "ScoreValue_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestVote" ADD CONSTRAINT "GuestVote_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestVoteChoice" ADD CONSTRAINT "GuestVoteChoice_guestVoteId_fkey" FOREIGN KEY ("guestVoteId") REFERENCES "GuestVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestVoteChoice" ADD CONSTRAINT "GuestVoteChoice_guestCategoryId_fkey" FOREIGN KEY ("guestCategoryId") REFERENCES "GuestCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestVoteChoice" ADD CONSTRAINT "GuestVoteChoice_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "Contestant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventWinner" ADD CONSTRAINT "EventWinner_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventWinner" ADD CONSTRAINT "EventWinner_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "Contestant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
