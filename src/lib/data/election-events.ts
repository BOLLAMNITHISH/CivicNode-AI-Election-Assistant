import { ElectionEvent } from "@/types";

// ─────────────────────────────────────────────
//  Valid US State Abbreviations
// ─────────────────────────────────────────────
export const VALID_STATES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
]);

// ─────────────────────────────────────────────
//  Mock Election Events Dataset
// ─────────────────────────────────────────────
export const MOCK_ELECTION_EVENTS: ElectionEvent[] = [

  // ── NATIONAL (Fallback — always included) ──────────────────────────────
  {
    id: "nat-1",
    state: "NATIONAL",
    eventType: "informational",
    date: "2026-09-01T00:00:00Z",
    title: "National Voter Registration Month",
    description:
      "September is National Voter Registration Month. Confirm your registration is current, especially if you have recently moved or changed your name. Every state has different deadlines — start early.",
    metadata: {
      tags: ["registration", "awareness"],
      sourceUrl: "https://www.vote.org/voter-registration-deadlines/",
    },
  },
  {
    id: "nat-2",
    state: "NATIONAL",
    eventType: "informational",
    date: "2026-10-01T00:00:00Z",
    title: "Request Your Mail-In Ballot",
    description:
      "Many states allow you to request an absentee or mail-in ballot well ahead of Election Day. Check your state's specific deadline — some require a request by mail and processing can take days.",
    actionRequired: true,
    metadata: {
      affectsMailIn: true,
      tags: ["mail-in", "absentee", "deadline"],
      sourceUrl: "https://www.vote.org/absentee-ballot/",
    },
  },
  {
    id: "nat-3",
    state: "NATIONAL",
    eventType: "voting",
    date: "2026-11-03T07:00:00Z",
    title: "General Election Day",
    description:
      "The nationwide General Election Day. Federal, state, and many local offices will be on the ballot. Polls open times vary by state — typically 6 AM to 8 PM local time. If you are in line before closing, you have the right to vote.",
    actionRequired: true,
    actionItems: [
      { id: "nat-3-a1", label: "Find your polling place", href: "https://www.vote.org/polling-place-locator/" },
      { id: "nat-3-a2", label: "Check what ID you need", href: "https://www.vote.org/voter-id-laws/" },
    ],
    metadata: {
      affectsInPerson: true,
      affectsMailIn: true,
      tags: ["election-day", "voting"],
      sourceUrl: "https://www.usa.gov/election-day",
    },
  },
  {
    id: "nat-4",
    state: "NATIONAL",
    eventType: "result",
    date: "2026-11-10T00:00:00Z",
    title: "Preliminary Results Published",
    description:
      "Most states will have certified preliminary results within a week of Election Day. Official certification timelines vary; some states take up to four weeks. Track your state's official election authority website.",
    metadata: {
      tags: ["results", "certification"],
    },
  },

  // ── NEW YORK (NY) ──────────────────────────────────────────────────────
  {
    id: "ny-1",
    state: "NY",
    eventType: "deadline",
    date: "2026-10-24T23:59:59Z",
    title: "Voter Registration Deadline (NY)",
    description:
      "Last day to register to vote in New York for the General Election. Online and in-person registration closes at midnight. Mailed applications must be postmarked by this date and received no later than October 29.",
    actionRequired: true,
    actionItems: [
      { id: "ny-1-a1", label: "Register online via NY DMV", href: "https://dmv.ny.gov/more-info/electronic-voter-registration-application" },
      { id: "ny-1-a2", label: "Check your current registration", href: "https://voterlookup.elections.ny.gov/" },
    ],
    metadata: {
      sourceUrl: "https://www.elections.ny.gov/",
      tags: ["registration", "deadline"],
    },
  },
  {
    id: "ny-2",
    state: "NY",
    eventType: "deadline",
    date: "2026-10-27T23:59:59Z",
    title: "Mail-In Ballot Request Deadline (NY)",
    description:
      "Last day to apply for an absentee ballot by mail for the November General Election in New York. You can also apply in person at your county Board of Elections up until the day before the election.",
    actionRequired: true,
    actionItems: [
      { id: "ny-2-a1", label: "Apply for absentee ballot", href: "https://www.elections.ny.gov/VotingAbsentee.html" },
    ],
    metadata: {
      affectsMailIn: true,
      sourceUrl: "https://www.elections.ny.gov/VotingAbsentee.html",
      tags: ["mail-in", "absentee", "deadline"],
    },
  },
  {
    id: "ny-3",
    state: "NY",
    eventType: "voting",
    date: "2026-10-24T06:00:00Z",
    title: "Early Voting Begins (NY)",
    description:
      "Early in-person voting opens across New York State. Locations and hours vary by county. You may vote at any early voting site in your county of registration — you do not need to go to your assigned Election Day poll site.",
    actionItems: [
      { id: "ny-3-a1", label: "Find early voting locations in your county", href: "https://www.elections.ny.gov/VotingEarly.html" },
    ],
    metadata: {
      affectsInPerson: true,
      sourceUrl: "https://www.elections.ny.gov/VotingEarly.html",
      tags: ["early-voting"],
    },
  },
  {
    id: "ny-4",
    state: "NY",
    eventType: "voting",
    date: "2026-11-01T00:00:00Z",
    title: "Early Voting Ends (NY)",
    description:
      "The last day to take advantage of early voting in New York. After today, you must either vote on Election Day (Nov 3) or ensure your absentee ballot is submitted on time.",
    metadata: {
      affectsInPerson: true,
      tags: ["early-voting"],
    },
  },

  // ── CALIFORNIA (CA) ───────────────────────────────────────────────────
  {
    id: "ca-1",
    state: "CA",
    eventType: "informational",
    date: "2026-10-05T08:00:00Z",
    title: "Mail Ballots Sent to All Voters (CA)",
    description:
      "California county elections officials begin automatically mailing vote-by-mail ballots to every active registered voter. You do not need to request one — watch your mailbox. You can track yours at WheresMyBallot.sos.ca.gov.",
    actionItems: [
      { id: "ca-1-a1", label: "Track your ballot", href: "https://www.sos.ca.gov/elections/ballot-status/wheres-my-ballot" },
    ],
    metadata: {
      affectsMailIn: true,
      sourceUrl: "https://www.sos.ca.gov/elections/voter-registration/",
      tags: ["mail-in", "ballot-mailing"],
    },
  },
  {
    id: "ca-2",
    state: "CA",
    eventType: "deadline",
    date: "2026-10-19T23:59:59Z",
    title: "Online Voter Registration Deadline (CA)",
    description:
      "Last day to register to vote or update your registration online in California for the General Election. After this date, you may still conditionally register and vote provisionally at your county elections office or polling place through Election Day.",
    actionRequired: true,
    actionItems: [
      { id: "ca-2-a1", label: "Register online via CA Secretary of State", href: "https://registertovote.ca.gov/" },
    ],
    metadata: {
      sourceUrl: "https://www.sos.ca.gov/elections/voter-registration/",
      tags: ["registration", "deadline"],
    },
  },
  {
    id: "ca-3",
    state: "CA",
    eventType: "voting",
    date: "2026-10-31T08:00:00Z",
    title: "In-Person Early Voting Opens (CA)",
    description:
      "Vote Centers open across California for in-person early voting. All registered voters in California can vote at any Vote Center in their county. Centers are open Saturday before Election Day through Election Day itself.",
    actionItems: [
      { id: "ca-3-a1", label: "Find a Vote Center near you", href: "https://www.sos.ca.gov/elections/polling-place" },
    ],
    metadata: {
      affectsInPerson: true,
      tags: ["early-voting", "vote-centers"],
    },
  },
  {
    id: "ca-4",
    state: "CA",
    eventType: "deadline",
    date: "2026-11-03T20:00:00Z",
    title: "Mail Ballot Return Deadline (CA)",
    description:
      "Your completed mail-in ballot must be postmarked by Election Day (Nov 3) and received by your county elections office within 7 days. If dropping off, it must arrive at a drop box or Vote Center by 8:00 PM on Election Day.",
    actionRequired: true,
    metadata: {
      affectsMailIn: true,
      tags: ["mail-in", "deadline", "ballot-return"],
    },
  },

  // ── TEXAS (TX) ────────────────────────────────────────────────────────
  {
    id: "tx-1",
    state: "TX",
    eventType: "deadline",
    date: "2026-10-05T23:59:59Z",
    title: "Voter Registration Deadline (TX)",
    description:
      "Texas law requires voter registration applications to be received — not just postmarked — by the county voter registrar at least 30 days before the election. This is one of the earliest deadlines in the nation.",
    actionRequired: true,
    actionItems: [
      { id: "tx-1-a1", label: "Register to vote in Texas", href: "https://www.votetexas.gov/register-to-vote/" },
      { id: "tx-1-a2", label: "Check your registration", href: "https://teamrv-mvp.sos.texas.gov/MVP/mvp.do" },
    ],
    metadata: {
      sourceUrl: "https://www.sos.state.tx.us/elections/voter/",
      tags: ["registration", "deadline"],
    },
  },
  {
    id: "tx-2",
    state: "TX",
    eventType: "voting",
    date: "2026-10-19T07:00:00Z",
    title: "Early Voting Begins (TX)",
    description:
      "Early voting locations open across Texas. In-person early voting runs from October 19 through October 30. Texas does not have universal mail-in voting — check eligibility requirements before applying for an absentee ballot.",
    actionItems: [
      { id: "tx-2-a1", label: "Find early voting locations", href: "https://www.votetexas.gov/voting/find-your-poll-place.html" },
    ],
    metadata: {
      affectsInPerson: true,
      sourceUrl: "https://www.votetexas.gov/",
      tags: ["early-voting"],
    },
  },
  {
    id: "tx-3",
    state: "TX",
    eventType: "deadline",
    date: "2026-10-23T17:00:00Z",
    title: "Absentee Ballot Request Deadline (TX)",
    description:
      "Texas has strict absentee voting rules — you must qualify (age 65+, disability, confined to jail, or away from county). Applications must be received by your county clerk by 5:00 PM, 11 days before the election.",
    actionRequired: true,
    metadata: {
      affectsMailIn: true,
      sourceUrl: "https://www.sos.state.tx.us/elections/voter/absentee.shtml",
      tags: ["mail-in", "absentee", "deadline"],
    },
  },

  // ── FLORIDA (FL) ─────────────────────────────────────────────────────
  {
    id: "fl-1",
    state: "FL",
    eventType: "deadline",
    date: "2026-10-05T23:59:59Z",
    title: "Voter Registration Deadline (FL)",
    description:
      "Florida's voter registration deadline is 29 days before the election. You can register online at RegisterToVoteFlorida.gov, by mail (must be postmarked by this date), or in person at your county Supervisor of Elections office.",
    actionRequired: true,
    actionItems: [
      { id: "fl-1-a1", label: "Register to vote in Florida", href: "https://registertovoteflorida.gov/home" },
    ],
    metadata: {
      sourceUrl: "https://dos.myflorida.com/elections/",
      tags: ["registration", "deadline"],
    },
  },
  {
    id: "fl-2",
    state: "FL",
    eventType: "deadline",
    date: "2026-10-24T23:59:59Z",
    title: "Vote-by-Mail Ballot Request Deadline (FL)",
    description:
      "Requests for vote-by-mail ballots in Florida must be received by the Supervisor of Elections no later than 7 days before the election. You can request online, by phone, in person, or in writing.",
    actionRequired: true,
    metadata: {
      affectsMailIn: true,
      sourceUrl: "https://dos.myflorida.com/elections/for-voters/voting/vote-by-mail/",
      tags: ["mail-in", "deadline"],
    },
  },
  {
    id: "fl-3",
    state: "FL",
    eventType: "voting",
    date: "2026-10-26T07:00:00Z",
    title: "Early Voting Period Opens (FL)",
    description:
      "Florida counties must offer at least 8 days of early voting, beginning no later than 10 days before Election Day and ending no earlier than 3 days before. Check your county Supervisor of Elections for exact locations and hours.",
    actionItems: [
      { id: "fl-3-a1", label: "Find early voting sites in your county", href: "https://dos.myflorida.com/elections/for-voters/voter-registration/voter-information-lookup/" },
    ],
    metadata: {
      affectsInPerson: true,
      tags: ["early-voting"],
    },
  },
];
