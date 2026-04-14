from abc import ABC, abstractmethod


class BloodRequestInterface(ABC):
    @abstractmethod
    def getAvailableUnits(self, bloodType, quantity):
        pass

    def getTotalBloodUnits(self, quantity):
        pass

    def getLowBloodGroup(self, quantity):
        pass
