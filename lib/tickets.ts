import {z} from 'zod';
export const statuses=['Open','In progress','Resolved'] as const;
export const priorities=['Critical','High','Medium','Low'] as const;
export const categories=['Account','Billing','Bug','Feature request'] as const;
export const createSchema=z.object({title:z.string().trim().min(5).max(140),description:z.string().trim().min(10).max(4000),category:z.enum(categories),priority:z.enum(priorities),assignee:z.string().trim().max(80).default('Unassigned')}).strict();
export const updateSchema=z.object({status:z.enum(statuses),priority:z.enum(priorities),assignee:z.string().trim().min(1).max(80),version:z.number().int().positive()}).strict();
export type Ticket={id:number;title:string;description:string;category:string;priority:string;status:string;assignee:string;created_at:string;updated_at:string;version:number};
export function suggestPriority(text:string):{priority:string;reason:string}{if(/outage|data loss|security breach|all users|production down/i.test(text))return {priority:'Critical',reason:'Possible widespread outage, security incident, or data loss.'};if(/cannot log|payment failed|blocked|crash/i.test(text))return {priority:'High',reason:'A core workflow appears blocked.'};if(/feature|suggestion|would like/i.test(text))return {priority:'Low',reason:'This appears to be an enhancement request.'};return {priority:'Medium',reason:'No critical or blocking keywords detected.'};}
