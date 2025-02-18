function extractTestCaseIDFromFirstElement(arr: string[]): string {
    if (arr.length === 0) {
        return '';
    }
    return extractTestCaseID(arr[0]);
}
function extractTestCaseID(input: string): string {
    const index = input.indexOf('@');
    if (index !== -1 && index < input.length - 1) {
        return input.substring(index + 1)+" | ";
    }
    return '';
}
export { extractTestCaseIDFromFirstElement, extractTestCaseID };