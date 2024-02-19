import { Link } from "react-router-dom";

export default function Rules() {  
    return (
        <div className="rulesDiv">
            <div className="backbutton"><Link to="/">Back</Link></div>
            <h1 align="center" className="ruleTexts">Rules of the Brag Game</h1>

            <ul className="ruleTexts">
                <li>There must be at least two players in the room to start the game.</li>
                <li>Each player have 5 dices.</li>
                <li>Each player can only see the dice results of the 5 dices in this player's own hand.</li>
                <li>The game starts from a random player in the room.</li>
                <li>The starting player would call for a number of dice result (for example, "four 3's"), and this number must be larger than or equal to three.</li>
                <li>
                    Then the next player have two options: to call or to open:
                    <ol>
                        <li>When the player choose to call, the player can only call for a larger number of the dice result (for example, "five 2's") or a number of larger dice result (for example, "three 4's").</li>
                        <li>When the player choose to open, this round of game ends, and the called dice result from the last player would be counted from all dice results in all players' hands. If this counted number of the called dice result is larger than or equal to the number last player called, the last player wins, otherwise, whoever choose to open wins.</li>
                    </ol>
                </li>
                <li>In this game, the dice result "1" could be counted as any dice result if it is not spcifically called (i.e., if a player called a number of 1's, then 1 is just 1; otherwise, 1 can be any dice result when counting the overall results).</li>
                <li>When a round of game ends, the host of the room could decide whether to contiue to the next round starting with the winner of this round, or to end the game.</li>
                <li>Players could only enter the room when there is no ongoing game in the room (i.e. when a round ends, the host has to click the "End Game" button before new players could join the room)</li>
            </ul>

            <h3 className="ruleTexts">Let's now look at an exampe of a round of game:</h3>
            
            <ul className="ruleTexts">
                <li>Game starts: player A has a 1, two 3's, a 4 and a 6; player B has two 1's, a 2, and two 5's. </li>
                <li>Player A looks at his own hand and called: "three 3's"</li>
                <li>Player B's round, player B look at her own hand, there is no 3's, but she has two 1's, which means if player A has one 3, she would lose if she opens at this point, so she calls: "four 2's", based on the two 1's and two 2's she has, if player A opens at this point, she would win.</li>
                <li>Player A then looked at his one dice resulted in 1 and think if player B has at least three 2's, which is highly possible in this case, he would lose if he opens, so he calls: "five 3's" </li>
                <li>Then player B calls: "five 5's" because it is not safe for her to open at this point, but not safe if she calls for 2 neither.</li>
                <li>Player A's round again, he thinks it is not likely that player B has four 5's to win, so he clicked "open".</li>
                <li>However, player B has two 1's and two 5's, which can be counted as four 5's, along with player A's one 1, which can be counted as a 5 in this case (since the called dice result is not 1), there are five 5's overall, so player B wins.</li>
            </ul>
        </div>
    );
}