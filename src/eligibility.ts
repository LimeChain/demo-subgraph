// import {
//     UniqueEligibilitiesSet as UniqueEligibilitiesSetEvent,
//     RangeSet as RangeSetEvent,
//     EligibilityModule as EligibilityModuleContract,
//   } from '../types/templates/EligibilityModule/EligibilityModule';
  
//   import { getEligibilityModule, updateEligibleTokenIds } from './helpers';
  
//   export function handleUniqueEligibilitiesSet(
//     event: UniqueEligibilitiesSetEvent,
//   ): void {
//     let moduleAddress = event.address;
//     let module = getEligibilityModule(moduleAddress);
  
//     let instance = EligibilityModuleContract.bind(moduleAddress);
//     let finalizedFromInstance = instance.try_finalized();
//     let finalized = finalizedFromInstance.reverted
//       ? module.finalizedOnDeploy
//       : finalizedFromInstance.value;
  
//     module.finalized = finalized;
  
//     module = updateEligibleTokenIds(
//       module,
//       event.params.tokenIds,
//       event.params.isEligible,
//     );
  
//     module.save();
//   }
  
//   export function handleRangeSet(event: RangeSetEvent): void {
//     let moduleAddress = event.address;
//     let module = getEligibilityModule(moduleAddress);
  
//     let instance = EligibilityModuleContract.bind(moduleAddress);
//     let finalizedFromInstance = instance.try_finalized();
//     let finalized = finalizedFromInstance.reverted
//       ? module.finalizedOnDeploy
//       : finalizedFromInstance.value;
  
//     module.finalized = finalized;
  
//     module.eligibleRange = [event.params.rangeStart, event.params.rangeEnd];
  
//     module.save();
//   }