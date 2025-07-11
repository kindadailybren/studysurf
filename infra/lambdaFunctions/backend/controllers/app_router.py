from fastapi import APIRouter

from controllers.genvid_controller import genvid_router

app_router = APIRouter()

app_router.include_router(genvid_router, tags=["GenVid"])
