"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoomTypeResponse } from "@/dtos/building";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteRoomType } from "@/services/room-typeService";
import { RoomStatus } from "@/constaints/enum";

interface RoomTypeDetailProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roomType: RoomTypeResponse;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function RoomTypeDetail({ open, onOpenChange, roomType, onEdit, onDelete }: RoomTypeDetailProps) {
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this room type?")) {
            return;
        }

        try {
            await deleteRoomType(roomType.roomTypeId);
            toast.success("Room type deleted successfully");
            onOpenChange(false);
            onDelete?.();
        } catch (error) {
            console.error("Error deleting room type:", error);
            toast.error("Failed to delete room type");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{roomType.typeName}</DialogTitle>
                    <DialogDescription>
                        ID: {roomType.roomTypeId}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Type Name</h3>
                            <p className="text-lg font-semibold mt-1">{roomType.typeName}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Type ID</h3>
                            <p className="text-sm font-mono mt-1 bg-muted p-2 rounded">{roomType.roomTypeId}</p>
                        </div>

                        {roomType.note && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                <p className="text-sm mt-1">{roomType.note}</p>
                            </div>
                        )}
                    </div>

                    {/* Rooms */}
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                            Associated Rooms ({roomType.rooms?.length || 0})
                        </h3>
                        {roomType.rooms && roomType.rooms.length > 0 ? (
                            <div className="space-y-2">
                                {roomType.rooms.map((room) => (
                                    <div
                                        key={room.roomId}
                                        className="flex items-center justify-between p-3 bg-muted rounded-md"
                                    >
                                        <div>
                                            <p className="font-medium">{room.roomName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {room.floorName} • Capacity: {room.capacity}
                                            </p>
                                        </div>
                                        <Badge variant={room.status === RoomStatus.Available ? "default" : "secondary"}>
                                            {room.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No rooms assigned to this type</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
