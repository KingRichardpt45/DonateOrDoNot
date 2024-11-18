import {User} from "@/models/User";
import {EntityManager} from "@/core/managers/EntityManager";
import {OperationResult} from "@/core/managers/OperationResult";
import {FormError} from "@/core/managers/FormError";
import {Donor} from "@/models/Donor";
import {UserManager} from "@/core/managers/UserManager";
import {UserRoleTypes} from "@/models/types/UserRoleTypes";
import {SimpleError} from "@/core/managers/SimpleError";

export class DonorManager extends EntityManager<Donor> {

    constructor() {
        super(Donor);
    }

    async signUp(donor: Donor): Promise<OperationResult<Donor | null, FormError>> {
        const errors: FormError[] = [];

        if (!donor.donacoins) {
            donor.donacoins = 0;
        } else if (donor.donacoins < 0) {
            errors.push(new FormError("donacoins", ["Donacoins must be greater than 0"]));
        }

        if (!donor.total_donations) {
            donor.total_donations = 0;
        } else if (donor.total_donations < 0) {
            errors.push(new FormError("total_donations", ["Total donations must be greater than 0"]));
        }

        if (!donor.total_donated_value) {
            donor.total_donated_value = 0;
        } else if (donor.total_donated_value < 0) {
            errors.push(new FormError("total_donated_value", ["Total donated value must be greater than 0"]));
        }

        if (!donor.frequency_of_donation) {
            donor.frequency_of_donation = 0;
        } else if (donor.frequency_of_donation < 0) {
            errors.push(new FormError("frequency_of_donation", ["Frequency of donation must be greater than 0"]));
        }

        if (!donor.frequency_of_donation_datetime) {
            donor.frequency_of_donation_datetime = 0;
        } else if (donor.frequency_of_donation_datetime < 0) {
            errors.push(new FormError("frequency_of_donation_datetime", ["Frequency of donation datetime must be greater than 0"]));
        }

        if (!donor.best_frequency_of_donation_datetime) {
            donor.best_frequency_of_donation_datetime = 0;
        } else if (donor.best_frequency_of_donation_datetime < 0) {
            errors.push(new FormError("best_frequency_of_donation_datetime", ["Best frequency of donation datetime must be greater than 0"]));
        }

        if (donor.type != UserRoleTypes.Donor) {
            errors.push(new FormError("type", ["User must be a donor"]));
        }

        const userManager = new UserManager();
        const createdUser = await userManager.signUp(donor as User);

        if (createdUser.errors.length == 0 && createdUser.value) {
            donor.id = createdUser.value.id;
            const createdDonor = await this.create(donor);
            return new OperationResult(createdDonor, errors);
        }

        createdUser.errors.forEach(error => errors.push(error));

        return new OperationResult(null, errors);
    }

    async signIn(email: string, password: string): Promise<OperationResult<User | null, SimpleError>> {
        const userManager = new UserManager();
        return userManager.signIn(email, password);
    }
}