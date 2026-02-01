import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secret Hitler - How to Play",
  description:
    "In here, you'll find a manual and a video explaining how to play.",
};

export default function HowToPlay() {
  return (
    <>
      <p className="mb-4">
        Below is a link to the official manual of the game, as well as a visual
        explanation. You can choose to read the official manual, watch the
        video, or read the manual I&apos;ve written below, or do all three. If
        you&apos;re new to the game, I highly recommend watching the video, as
        it explains the game in a very clear and concise manner. It doesn&apos;t
        cover all the edge cases, but it&apos;ll give you a solid understanding
        of the game mechanics. If you&apos;re playing this web version, you
        don&apos;t need to worry about the edge cases, as the game will handle
        them for you. You might want to read my manual once you get the hang of
        the game, as it contains some strategic advice on how to play as each
        role in the bottom section of my manual.
      </p>
      <a
        href="https://www.secrethitler.com/assets/Secret_Hitler_Rules.pdf"
        target="_blank"
        className="text-amber-600 underline mb-4 block font-bold"
      >
        Official Manual
      </a>
      <p className="mb-4">
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/APiugylcAJw?si=MK_gsJI8g2d-p4Ie"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </p>
      <h1 className="mb-4 font-bold">The game:</h1>
      <p className="mb-4">
        You are randomly divided into two teams - liberals and fascists. One of
        the fascists will be given the role of Hitler. The win condition for
        each team is to pass a certain number of policies. For liberals,
        it&apos;s 5 policies. For fascists, it&apos;s 6. Additionally, liberals
        can also win if they execute Hitler, whereas fascists can also win if
        they elect Hitler as a Chancellor during a certain point in the game,
        which will be explained further in the next paragraphs.
      </p>
      <p className="mb-4">
        The game has different rule sets and different fascist boards for a
        different amount of players, and they slightly change between 3 modes:
        5-6 players, 7-8 players and 9-10 players. There are always 11 fascist
        policy cards and 6 liberal policy cards at the start of the game,
        meaning fascist policy cards are much more likely to be drawn. Once the
        draw pile is below 3 cards, it is merged with the discard pile and
        shuffled.
      </p>
      <h4 className="mb-4 font-bold">5-6 players:</h4>
      <p className="mb-4">
        There are 2 fascists, with one of them also being Hitler. Both fascists
        know who the fascists are, meaning they know who is liberal. The
        liberals never know anything about anyone under any rule set.
      </p>
      <h4 className="mb-4 font-bold">7-8 / 9-10 players:</h4>
      <p className="mb-4">
        There are 3, and 4 fascists respectively, with one of them also being
        Hitler. All fascists EXCEPT for Hitler, know who the fascists are. They
        know who Hitler is. Hitler doesn&apos;t know who anyone is, just like
        the liberals.
      </p>
      <h4 className="mb-4 font-bold">Flow of the game:</h4>
      <p className="mb-4">
        The game is played in rounds. At the beginning of each round, a new
        President is automatically chosen, based on the order of the players
        from left to right (clock-wise if you&apos;re playing with a physical
        board and are forming a circle of sorts). The President can consult with
        the rest of the players regarding who he should pick to be the
        Chancellor, but ultimately, the decision is up to the President. Once
        the President chooses a Chancellor, the decision is put to a vote (yea /
        nay) where all players participate. If there are more yeas than nays,
        the vote passes. If not, the government dissolves (more on that later).
      </p>
      <p className="mb-4">
        Once a Chancellor has been chosen, the President who chose him draws 3
        policy cards from the draw pile, which are only visible to him. A policy
        card can be either liberal or fascist. He discards 1 of the cards he
        drew to the discard pile, and passes the remaining 2 cards to the
        Chancellor. The discarded card&apos;s policy is only known to the
        President. The Chancellor then discards 1 of the cards he received,
        which again, is only known to him, and plays the remaining card on the
        board. After a policy was enacted, both the President and the Chancellor
        can reveal (or lie about) what they got. Everyone should claim
        they&apos;re liberal at all times, so if a fascist policy is enacted and
        the President claims to have passed 1 of each policy to the Chancellor,
        then the Chancellor will obviously proclaim he got 2 fascist policy
        cards and had no chance but to play one. this creates a conflict between
        the President and the Chancellor because at least one of them is
        obviously lying.
      </p>
      <h4 className="mb-4 font-bold">Events:</h4>
      <p className="mb-4">
        There are several events throughout the game which are triggered once a
        certain number of fascist policies are enacted, and they are separated
        into 2: persistent and Presidential powers.
      </p>
      <h4 className="mb-4 font-bold">Events - Persistent:</h4>
      <p className="mb-4">
        These occur once a certain number of fascist policies are enacted(as
        seen on the board). Once a persistent event occurs, it goes into effect
        throughout the rest of the game.
      </p>
      <ul className="mb-4 list-disc list-inside">
        <li>
          <span className="text-amber-600">The Hitler Zone</span>: Once 3
          fascist policies are enacted, Hitler being elected as Chancellor
          results in a fascist victory. Liberals must be very cautious of who
          they vote for Chancellor.
        </li>
        <li>
          <span className="text-amber-600">Veto Power</span>: Once 5 fascist
          policies are enacted, a Chancellor can ask to veto the cards he
          received from his President, and the President can oblige the request,
          or reject it. If the President obliges the request, the government
          dissolves (again, more on that later). If the President rejects the
          veto, the Chancellor is obliged to play his hand (which means he got 2
          of the same, but is unwilling to play it). For instance, if a liberal
          President gets 3 cards, and they all happen to be fascist, meaning he
          passes 2 fascist policy cards to his Chancellor, who also happens to
          be a liberal, then the President should obviously oblige a veto
          request from his Chancellor.
        </li>
      </ul>
      <h4 className="mb-4 font-bold">Events - Presidential Powers:</h4>
      <p className="mb-4">
        These occur once a certain number of fascist policies are enacted (as
        seen on the board). The President at the end of the round that a fascist
        policy was enacted, will be given a one-time special power that he must
        immediately use. Presidents should generally consult with the other
        players regarding their choice (except for Policy Peek which
        doesn&apos;t pertain to other players), but ultimately, the choice is
        the President&apos;s. Be advised, however, that a hasty choice with
        little to no consulting, is usually something a fascist would do to
        create confusion and therefore even fascists might want consult with
        other players. If you&apos;ll take an action that other players disagree
        with, this can cast doubt on you. If you do not want to consult with
        other players, you should at least attempt to convince them of your
        reasoning for acting the way you do, BEFORE actually acting.
      </p>
      <ul className="mb-4 list-disc list-inside">
        <li>
          <span className="text-amber-600 font-bold">
            Policy Peek (only found in 5-6 players)
          </span>
          : The President peeks at the top 3 cards from the draw pile for a
          one-time only (left-most card is at the top of the pile). The
          President is then free to share this information with the other
          players (or lie about it, if he&apos;s a fascist). Note that if you
          lie about it, and the next President is a liberal (considering the
          draw pile didn&apos;t change since then via the government
          dissolving), he&apos;ll know you&apos;re lying.
        </li>
        <li>
          <span className="text-amber-600 font-bold">
            Investigate Loyalty (only found in 7-8 / 9-10 players)
          </span>
          : The President chooses a player to investigate. The investigated
          player reveals his party membership (NOT THE ROLE) to the President.
          The President should then tell the rest of the players what he
          discovered. He can also lie, of course.
        </li>
        <li>
          <span className="text-amber-600 font-bold">
            Special Election (only found in 7-8 / 9-10 players)
          </span>
          : The President breaks the Presidential cycle for the next round and
          picks the next President. The Presidential cycle goes back to normal
          after that round. Note that if the President picks the person next in
          line to be President within the Presidential cycle, that person will
          be President for 2 rounds in a row.
        </li>
        <li>
          <span className="text-amber-600 font-bold">
            Execution (found in all modes)
          </span>
          : The President chooses to execute another player. If that player
          turns out to be Hitler, the game ends in a liberal victory. The
          executed player&apos;s secret role is only revealed if he&apos;s
          Hitler. Otherwise, the players (including the executioner) don&apos;t
          know the executed player&apos;s party membership. Additionally, the
          executed player is not allowed to speak and engage in the decisions
          going on among the players, and he also loses his voting rights (being
          dead tends to do that to people).
        </li>
      </ul>
      <h4 className="mb-4 font-bold">Government dissolves:</h4>
      <p className="mb-4">
        As discussed before, a government can dissolve when certain criteria are
        met, like when a vote for a government doesn&apos;t get the necessary
        votes to pass. When that happens, the election tracker moves up a stage,
        and a new round begins. If the government dissolves 3 times in a row,
        the top card from the draw pile is played on the board. If it&apos;s a
        fascist policy that normally triggers a Presidential Power, that power
        is ignored and lost. Once a policy passes, whether due to the government
        dissolving 3 times in a row or due to the government enacting a policy,
        the election tracker is reset.
      </p>
      <h4 className="mb-4 font-bold">Term limits:</h4>
      <p className="mb-4">
        The last elected President and Chancellor (not merely nominated, meaning
        if a vote doesn&apos;t pass, then they weren&apos;t elected) are
        &quot;term-limited&quot;, meaning they&apos;re ineligible to be
        nominated as Chancellors. Note that this only affects Chancellorship.
        The last elected Chancellor can still be President. If there are only
        five or less players left in the game (either because you are 5 players,
        or because some were executed in the game), only the last elected
        Chancellor is ineligible to be nominated as a Chancellor.
      </p>
      <h4 className="mb-4 font-bold">How to play as each role?</h4>
      <ul className="mb-4 list-disc list-inside">
        <li>
          <span className="text-amber-600 font-bold">Liberal</span>: You have no
          incentive to lie. Always tell the truth. You need to figure out who
          you can trust, and convince others of your reasoning.
        </li>
        <li>
          <span className="text-amber-600 font-bold">Fascist</span>: There are
          various ways to play as a fascist but ultimately, it depends on the
          situation. Sometimes you&apos;ll want to tell the truth and fly under
          the radar. Sometimes you&apos;ll want to lie in order to enact a
          fascist policy. You&apos;ll also want to create chaos and confusion
          under certain circumstances, starting conflicts with other people,
          even with other fascists in some cases. A fascist can use the
          suspicion of other players towards him to his own advantage,
          manipulating them into trusting other players they shouldn&apos;t
          trust, or doubting players they should trust.
        </li>
        <li>
          <span className="text-amber-600 font-bold">Hiter</span>: As a rule of
          thumb, you should generally play Hitler like you play a liberal, only
          lying when it can&apos;t be corroborated by other liberals, and rely
          more on your fellow fascists to enact fascist policies and create
          opportunities for you. There are sound reasons (not necessarily right
          or wrong) for a Hitler President in the early rounds to pass 1 of each
          policy to his Chancellor, despite if opportunity arises to pass 2
          fascists, because even though it&apos;s fairly likely to get 3 fascist
          cards, especially in the early rounds or when several liberal policies
          were already enacted, you might want to strengthen the lie that
          you&apos;re a liberal so you&apos;d be more likely to get elected as a
          Chancellor once (or rather, if) the game has entered into the Hitler
          zone.
        </li>
      </ul>
    </>
  );
}
