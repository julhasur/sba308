// Example data below generated ny Ai to make the process little faster.
let courseInfo = {
    id: 1,
    name: "Math 101"
};

let assignmentGroups = [
    {
        id: 1,
        name: "Homework",
        course_id: 1,
        group_weight: 0.5,
        assignments: [
            {
                id: 101,
                name: "Homework 1",
                due_at: "2024-11-20T23:59:59",
                points_possible: 100
            },
            {
                id: 102,
                name: "Homework 2",
                due_at: "2024-11-19T23:59:59",
                points_possible: 50
            }
        ]
    }
];

let learnerSubmissions = [
    {
        learner_id: 1,
        assignment_id: 101,
        submission: {
            submitted_at: "2024-11-20T20:00:00",
            score: 90
        }
    },
    {
        learner_id: 1,
        assignment_id: 102,
        submission: {
            submitted_at: "2024-11-20T00:00:00",
            score: 45
        }
    },
    {
        learner_id: 2,
        assignment_id: 101,
        submission: {
            submitted_at: "2024-11-21T01:00:00",
            score: 80
        }
    }
];
function getLearnerData(courseInfo, assignmentGroups, learnerSubmissions) {
    try {
        // Validate input data
        validateData(courseInfo, assignmentGroups);

        // Create an array to store the results
        let results = [];

        // Loop through each learner submission
        for (let i = 0; i < learnerSubmissions.length; i++) {
            let submission = learnerSubmissions[i];
            let learnerId = submission.learner_id;

            let totalWeightedScore = 0;
            let totalWeight = 0;

            // Object to store individual assignment percentages
            let assignmentScores = {};

            // Loop through assignment groups
            for (let j = 0; j < assignmentGroups.length; j++) {
                let group = assignmentGroups[j];

                for (let k = 0; k < group.assignments.length; k++) {
                    let assignment = group.assignments[k];

                    try {
                     
                        if (new Date(assignment.due_at) <= new Date()) {
                        
                            let score = calculateScore(submission, assignment);

                            // If the learner submitted this assignment
                            if (score !== null) {
                                totalWeightedScore += score * assignment.points_possible;
                                totalWeight += assignment.points_possible;
                                assignmentScores[assignment.id] = (score * 100).toFixed(2);
                            }
                        }
                    } catch (error) {
                        console.error(
                            `Error processing assignment ID ${assignment.id}: ${error.message}`
                        );
                    }
                }
            }

          
            let average = totalWeight > 0 ? (totalWeightedScore / totalWeight * 100).toFixed(2) : 0;

          
            let learnerResult = {
                id: learnerId,
                avg: Number(average)
            };

            for (let assignmentId in assignmentScores) {
                learnerResult[assignmentId] = Number(assignmentScores[assignmentId]);
            }

            results.push(learnerResult);
        }

        // Return the final results array
        return results;

    } catch (error) {
       
        console.error("Error processing learner data:", error.message);
        return [];
    }
}

 function validateData(courseInfo, assignmentGroups) {
    try {
        
        for (let i = 0; i < assignmentGroups.length; i++) {
            let group = assignmentGroups[i];

            // matches the course info
            if (group.course_id !== courseInfo.id) {
                throw new Error("Assignment group course_id does not match the course id.");
            }

            // Loop through the assignments 
            for (let j = 0; j < group.assignments.length; j++) {
                let assignment = group.assignments[j];

                // Check that points_possible is greater than 0
                if (assignment.points_possible <= 0) {
                    throw new Error("Assignment points_possible must be greater than 0.");
                }
            }
        }
    } catch (error) {
        throw new Error(`Validation failed: ${error.message}`);
    }
}

// Function to calculate the score for a submission
function calculateScore(submission, assignment) {
    try {
      
        if (submission.assignment_id === assignment.id) {
            if (submission.submission && submission.submission.score !== undefined) {
                let score = submission.submission.score;

                // Deduct 10% if the submission was late
                if (new Date(submission.submission.submitted_at) > new Date(assignment.due_at)) {
                    score -= assignment.points_possible * 0.1;
                }

                
                return Math.max(score / assignment.points_possible, 0);
            }
        }

        // Return null jk if the submission is not for the given assignment or does not have a score
        return null;
    } catch (error) {
        throw new Error(`Error calculating score: ${error.message}`);
    }
}


// Run the function and log the results
let results = getLearnerData(courseInfo, assignmentGroups, learnerSubmissions);
console.log(results);
