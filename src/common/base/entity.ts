import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Generated } from 'typeorm';
import { Expose } from 'class-transformer';

export class BaseEntity {
    constructor() { }

    @PrimaryGeneratedColumn()
    @IsNumber()
    @Expose()
    id: number;

    @IsString()
    @Column()
    @Expose()
    @Generated('uuid')
    uuid: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    @Expose()
    createdAt: Date;

    @Column({ name: 'created_by', nullable: true, default: null })
    @Expose()
    createdBy: number;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    @IsOptional()
    @Expose()
    updatedAt: Date;

    @Column({ name: 'updated_by', nullable: true, default: null })
    @Expose()
    updatedBy: number;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    @IsOptional()
    @Expose()
    deletedAt: Date;

    public cleanBodyParams(): Record<string, any> {
        return Object.entries(this).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, any>);
    }

}