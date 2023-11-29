// 프로그래머스 level 1 - 폰켓몬 1845

function solution(nums) {
	const totalPhoneketmonTypeCount = new Set([...nums]).size;
	const takablePhoneketmonCount = nums.length / 2;
					
	let selectedMaxPhoneketmonTypeCount = totalPhoneketmonTypeCount;
	
	if (totalPhoneketmonTypeCount > takablePhoneketmonCount) {
			selectedMaxPhoneketmonTypeCount = takablePhonetkemonCount;
	}
	
	return selectedMaxPhoneketmonTypeCount;
}