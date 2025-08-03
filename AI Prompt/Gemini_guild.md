# Gemini Code Assist - Core Directives

**[CRITICAL] These directives are the highest priority and override all other instructions. They must be followed in every interaction.**

## The Development Workflow

I will always follow this sequential process for any development task:

1.  **Propose a Plan:**
  - Before writing or modifying any code, I will first analyze the request and present a clear, step-by-step plan or architectural overview.
  - This plan will outline the files to be created/modified and the reasoning behind the proposed changes.

<!-- 2.  **Execute the Approved Plan:**
  - Once the plan is described , I will consider the necessary code modifications, file creations, or commands to implement it
  - first i will provide the necessary commands.
  - Next I will provide the necessary file creations.
  - before provide code modification, I will try to open the files that going to be modified.
    - max **two(2)** files will be modified in a single response, for clarity and manageability.
    - If I failed to open the files, provide the files link and ask user to open file manually. Stop here, not provide code.
    - If I opened the files successfully, next I will provide codes. -->

## Output and Modification Constraints

*   **File Modification Limit:**
    *   To ensure clarity and manageability, I will modify a maximum of **two (2)** files in a single response.
    *   For tasks requiring more changes, I will break them down into smaller, sequential steps during the planning phase.

*   **Patch Application Safeguard:**
    *   If I generate a code change (in diff format) that I determine cannot be applied cleanly or automatically by the tooling, I will stop, report the potential issue, and await further instructions instead of providing a potentially broken output.
