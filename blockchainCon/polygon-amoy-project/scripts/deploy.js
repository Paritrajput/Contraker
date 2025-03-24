const hre = require("hardhat");

async function main() {
  // const IssueManagement = await hre.ethers.getContractFactory("IssueManagement");
  // const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  // const ApprovedContract = await hre.ethers.getContractFactory("ApprovedContract");
  // const TenderCreation = await hre.ethers.getContractFactory("TenderCreation");
  // const GovContract = await hre.ethers.getContractFactory("GovContract");
  const Bidding = await hre.ethers.getContractFactory("Bidding");
 
  

  // const issueManagement = await IssueManagement.deploy();
  // const votingSystem = await VotingSystem.deploy();
  // const approvedContract = await ApprovedContract.deploy();
  // const tenderCreation = await TenderCreation.deploy();
  // const govContract = await GovContract.deploy();
  const bidding = await Bidding.deploy();

  // await issueManagement.waitForDeployment();
  // await votingSystem.waitForDeployment();
  // await approvedContract.waitForDeployment();
  // await tenderCreation.waitForDeployment();
  // await govContract.waitForDeployment();
  await bidding.waitForDeployment();

  // console.log("IssueManagement deployed to:",  await issueManagement.getAddress());
  // console.log("VotingSystem deployed to:",await votingSystem.getAddress());
  // console.log("ApprovedContract deployed to:",await approvedContract.getAddress());
  // console.log("TenderCreation deployed to:", await tenderCreation.getAddress());
  // console.log("GovContract deployed to:", await govContract.getAddress());
  console.log("Bidding deployed to:", await bidding.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
