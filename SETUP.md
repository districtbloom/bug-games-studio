# Setting up so every game chat pushes through git

**The goal:** every game pushes to GitHub by itself, with no zips, no bundles and no one carrying files.

**Chat vs Code session.** A plain claude.ai chat cannot push to GitHub at all: its sandbox has no GitHub login. That is why Pardon's push failed on 21 Oct. Only a Code session pushes, either a cloud session started with the repositories selected, or a desktop-app session on a computer that has git access (the PC through Orca, or the Mac). The five design-pass games live in plain chats today, so each one moves once, by bundle (see "Moving an existing game"), and then lives in a Code session.

**Cloud limit:** a cloud session can only push to the repositories it was started with; none can be added once it's running.

## Once, on GitHub (Yelnur)

1. **Install the Claude GitHub App on the `districtbloom` organization, with access to all repositories.**
   - Go to github.com/apps/claude, then Configure, then `districtbloom`. Under repository access, choose "All repositories".
   - "All" means every new game repository works without coming back here.
   - Private repositories can't be reached by cloud sessions without it.

## Once per Claude account that will run games in the cloud (Yelnur) — skip for the PC route

2. **Connect GitHub on that account.** Not needed for plain chats (they can't push anyway) nor for desktop-app sessions on the PC or Mac.
   - Open claude.ai/code and connect GitHub, signed in as the GitHub user that's in `districtbloom`.
   - Check: the repository picker lists `districtbloom/bug-games-studio`.

## Once per game

3. **Give the game its own repository, `districtbloom/<slug>`, private.** Its code goes there. The studio holds only the pictures and words.
   - **New game:** create the repository first, then start its chat with it.
   - **A game that already lives in a chat** (the five design-pass games): its old chat writes a handoff and a bundle; the design chat puts them on GitHub. See "Moving an existing game" below.

## Every session for a game

4. **Start a cloud session with two repositories selected:** `districtbloom/<slug>` and `districtbloom/bug-games-studio`. Then paste `START-MESSAGE.md` with the game's slug.
5. **Before the session ends, the chat pushes both:** the game's code to `districtbloom/<slug>`, and its art and words branch to the studio, with a pull request.

**The local alternative:** run the game's session in the desktop app with **Local** selected, in a clone of both repositories on the PC or the Mac. It pushes with the computer's own git access. The computer has to stay on while it works.

## Moving an existing game (one time)

1. **In the old chat, paste:**

   > Write `HANDOFF.md` at the root of the game's repository:
   > - what the game is;
   > - how to run and build it;
   > - where everything lives;
   > - what's in progress;
   > - what you'd do next.
   >
   > Commit it. Then make two bundles and give me both files:
   > - `git bundle create <slug>-game.bundle --all` in the game's repository;
   > - `git bundle create <slug>-round-<n>.bundle main..<slug>/round-<n>` in the studio clone, if you have studio commits.

2. **Create the empty private repository `districtbloom/<slug>`** on GitHub, or ask the main chat to.
3. **Download both bundles to the Mac** and tell the design chat. It pushes the game's history to `districtbloom/<slug>`, pushes the round branch to the studio, and opens the pull request.
4. **Start the game's new Code session**, in the cloud with both repositories selected, or on the PC through Orca in clones of both, and tell it: "You're the chat for <Game>. Read `HANDOFF.md`, then `START-MESSAGE.md` in the studio."
