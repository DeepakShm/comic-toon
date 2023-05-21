import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleManageController } from './role/roleManage.controller';
import { RoleManageService } from './role/roleManage.service';

@Module({
  controllers: [UserController, RoleManageController],
  providers: [UserService, RoleManageService],
  exports: [UserService, RoleManageService],
})
export class UserModule {}
