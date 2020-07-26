class Request {
    constructor(token, projectId) {
        this.token = token;
        this.projectId = projectId;
    }
    static new(props) {
        return new this(props.token, props.projectId);
    }

    getBranchFromGitlabAsync = async (issueId) => {
        console.log('Fetching branch of: "' + issueId + '"');
        const response = await fetch(encodeURI(`https://gitlab.com/api/v4/projects/${this.projectId}/repository/branches?search=${issueId}`), {
            method: 'GET',
            headers: {
                'PRIVATE-TOKEN': this.token
            }
        });
        const myJson = await response.json(); //extract JSON from the http response

        console.log(myJson);

        return myJson;
    }

    postBranchOnGitlabAsync = async (branchName) => {
        console.log('Creating branch with name: "' + branchName + '"');
        const response = await fetch(encodeURI(`https://gitlab.com/api/v4/projects/${this.projectId}/repository/branches?branch=${branchName}&ref=master`), {
            method: 'POST',
            headers: {
                'PRIVATE-TOKEN': this.token
            }
        });
        const myJson = await response.json(); //extract JSON from the http response

        console.log(myJson);

        return myJson;
    }

}

export default Request;

