# The Fifth Official

Built in about a week in October 2026. I handled all of it: design, backend, AI agents, frontend, and the Azure deployment.

All clubs, players and match data are synthetic and fictional.

# Highlights

- **Multi-agent pipeline** on Microsoft Agent Framework and Foundry, with Explainer, Verifier, Reviewer, Q&A and Personalizer agents
- **0 of 275 planted false claims** reached the screen in evaluation
- **About $0.15 in AI cost for a full match**, and caching saves 98% of model calls for repeat viewers
- **200 concurrent live viewers** on one server process in a load test
- **Pitch control, expected goals (xG), pass difficulty, a pass network and chance quality**, all from a custom 90-minute match simulator
- **203 automated tests**, including a mutation test that proves the verifier blocks any changed number
