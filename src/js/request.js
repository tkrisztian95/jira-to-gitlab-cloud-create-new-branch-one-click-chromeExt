class Request {
    constructor(token, projectId) {
        this.token = token;
        this.projectId = projectId;
    }
    static new(props) {
        return new this(props.token, props.projectId);
    }

    searchBranch(search){
        return fetch(encodeURI(`https://gitlab.com/api/v4/projects/${this.projectId}/repository/branches?search=${search}`), {
            method: 'GET',
            headers: {
                'PRIVATE-TOKEN': this.token
            }
        });
    }

     createNewBranch(name, from){
        return fetch(encodeURI(`https://gitlab.com/api/v4/projects/${this.projectId}/repository/branches?branch=${name}&ref=${from}`), {
            method: 'POST',
            headers: {
                'PRIVATE-TOKEN': this.token
            }
        });
    }

}

export default Request;

